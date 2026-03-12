import React, { useEffect, useState, useRef } from 'react';
import { Page, Box, Text, Button, Input, useSnackbar, useParams, useNavigate } from '../components/UIComponents';
import { useRecoilState } from 'recoil';
import { currentVisitState, visitTargetsState, VisitTarget } from '../state/atoms';
import { visitService } from '../services/visitService';
import {
  getCurrentLocation,
  validateLocation,
} from '../utils/location';
import { selectImages } from '../utils/image';
import {
  validateCheckIn,
  validateCheckOut,
  calculateProgress,
} from '../utils/helpers';
import { formatDateTime, calculateDuration, formatDuration } from '../utils/date';

const VisitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [currentVisit, setCurrentVisit] = useRecoilState(currentVisitState);
  const [visitTargets, setVisitTargets] = useRecoilState(visitTargetsState);

  const [visitTarget, setVisitTarget] = useState<VisitTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Working state
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      loadVisitTarget();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [id]);

  useEffect(() => {
    if (currentVisit && id && currentVisit.visit_target_id === parseInt(id)) {
      // Start timer
      const interval = setInterval(() => {
        const mins = calculateDuration(currentVisit.checkin_time);
        setDuration(mins);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [currentVisit, id]);

  const loadVisitTarget = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await visitService.getVisitTargetDetail(id);
      setVisitTarget(data);
    } catch (error) {
      console.error('Error loading visit target:', error);
      openSnackbar({ text: 'Không thể tải dữ liệu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!visitTarget) return;
    
    try {
      setProcessing(true);

      // Get GPS location
      const location = await getCurrentLocation();

      // Validate distance
      const { isValid, distance } = validateLocation(
        location.latitude,
        location.longitude,
        visitTarget.customer.latitude,
        visitTarget.customer.longitude
      );

      const validation = validateCheckIn(distance);
      if (!validation.isValid) {
        openSnackbar({ text: validation.message, type: 'error' });
        return;
      }

      // Call check-in API
      const visit = await visitService.checkIn({
        visit_target_id: visitTarget.id,
        customer_id: visitTarget.customer_id,
        checkin_latitude: location.latitude,
        checkin_longitude: location.longitude,
      });

      setCurrentVisit(visit);
      openSnackbar({ text: 'Check-in thành công!', type: 'success' });
    } catch (error: any) {
      console.error('Error checking in:', error);
      openSnackbar({
        text: error.response?.data?.message || 'Lỗi check-in',
        type: 'error',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleAddPhotos = async () => {
    try {
      console.log('📸 handleAddPhotos called, current photos:', photos.length);
      const images = await selectImages(5 - photos.length);
      console.log('✅ Got images:', images.length, images);
      setPhotos([...photos, ...images]);
      console.log('✅ Photos updated');
      if (images.length > 0) {
        openSnackbar({ text: `Đã thêm ${images.length} ảnh`, type: 'success' });
      }
    } catch (error) {
      console.error('❌ Error selecting images:', error);
      openSnackbar({ text: 'Không thể chọn ảnh', type: 'error' });
    }
  };

  const handleTakePhoto = () => {
    console.log('📷 handleTakePhoto - triggering file input');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChooseFromAlbum = () => {
    console.log('🖼️ handleChooseFromAlbum - triggering file input');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 File input change event');
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('⚠️ No files selected');
      return;
    }
    
    const maxAdd = 5 - photos.length;
    console.log(`📸 Files selected: ${files.length}, can add: ${maxAdd}`);
    const fileArray = Array.from(files).slice(0, maxAdd);
    
    try {
      const imageUrls: string[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        console.log(`📸 Reading file ${i + 1}/${fileArray.length}:`, file.name);
        const reader = new FileReader();
        const url = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        imageUrls.push(url);
      }
      
      console.log('✅ Converted files to URLs:', imageUrls.length);
      setPhotos([...photos, ...imageUrls]);
      openSnackbar({ text: `Đã thêm ${imageUrls.length} ảnh`, type: 'success' });
      
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    } catch (error) {
      console.error('❌ Error processing files:', error);
      openSnackbar({ text: 'Không thể xử lý ảnh', type: 'error' });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleCheckOut = async () => {
    if (!currentVisit || !visitTarget) return;
    
    try {
      setProcessing(true);

      // Validate
      const validation = validateCheckOut(duration, photos);
      if (!validation.isValid) {
        openSnackbar({ text: validation.message, type: 'error' });
        return;
      }

      // Get GPS location
      const location = await getCurrentLocation();

      // Call check-out API
      await visitService.checkOut(currentVisit.id, {
        checkout_latitude: location.latitude,
        checkout_longitude: location.longitude,
        photos: photos,
        notes: notes,
      });

      // Update state
      setCurrentVisit(null);
      setPhotos([]);
      setNotes('');

      // Refresh visit target
      await loadVisitTarget();

      // Update visit targets list
      const updatedTargets = visitTargets.map((t) => {
        if (t.id === visitTarget.id) {
          return { ...t, actual_visits: t.actual_visits + 1 };
        }
        return t;
      });
      setVisitTargets(updatedTargets);

      openSnackbar({
        text: `Hoàn thành lượt thăm thứ ${visitTarget.actual_visits + 1}!`,
        type: 'success',
      });

      // Navigate back
      setTimeout(() => navigate('/visit-plan'), 1500);
    } catch (error: any) {
      console.error('Error checking out:', error);
      openSnackbar({
        text: error.response?.data?.message || 'Lỗi check-out',
        type: 'error',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <Box p={4}>
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (!visitTarget) {
    return (
      <Page>
        <Box p={4}>
          <Text>Không tìm thấy khách hàng</Text>
        </Box>
      </Page>
    );
  }

  const isInVisit = currentVisit && currentVisit.visit_target_id === visitTarget.id;
  const progress = calculateProgress(
    visitTarget.actual_visits,
    visitTarget.target_visits
  );

  return (
    <Page className="visit-detail-page">
      <Box p={4}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <Button
            size="small"
            variant="tertiary"
            onClick={() => navigate('/visit-plan')}
            style={{ marginBottom: '12px' }}
          >
            ← Quay lại
          </Button>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {visitTarget.customer?.name}
          </h1>
          <Text style={{ color: '#999', marginTop: '4px' }}>
            {visitTarget.customer?.address}
          </Text>
        </div>

        {/* Progress Card */}
        <div className="card">
          <Text size="small" style={{ color: '#999' }}>
            Tiến độ thăm viếng
          </Text>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              marginBottom: '8px',
            }}
          >
            <Text bold size="large">
              {visitTarget.actual_visits} / {visitTarget.target_visits}
            </Text>
            <Text style={{ color: progress >= 100 ? '#00c851' : '#ff4444' }}>
              {Math.round(progress)}%
            </Text>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Not in visit - Show Check-in button */}
        {!isInVisit && (
          <div className="card" style={{ marginTop: '16px' }}>
            <Button
              className="btn-large btn-primary"
              onClick={handleCheckIn}
              disabled={processing || visitTarget.actual_visits >= visitTarget.target_visits}
            >
              {processing ? 'Đang xử lý...' : 'CHECK-IN'}
            </Button>
            {visitTarget.actual_visits >= visitTarget.target_visits && (
              <Text
                size="small"
                style={{ color: '#00c851', marginTop: '8px', textAlign: 'center' }}
              >
                ✓ Đã hoàn thành chỉ tiêu
              </Text>
            )}
          </div>
        )}

        {/* In visit - Show working interface */}
        {isInVisit && (
          <>
            {/* Timer */}
            <div
              className="card"
              style={{
                marginTop: '16px',
                background: '#fff3cd',
                textAlign: 'center',
              }}
            >
              <Text size="small" style={{ color: '#856404' }}>
                ⏱ Thời gian thăm
              </Text>
              <Text
                size="xxLarge"
                bold
                style={{ color: '#856404', marginTop: '8px' }}
              >
                {formatDuration(duration)}
              </Text>
              <Text size="xSmall" style={{ color: '#856404', marginTop: '4px' }}>
                Check-in lúc: {formatDateTime(currentVisit.checkin_time)}
              </Text>
            </div>

            {/* Photos */}
            <div className="card" style={{ marginTop: '16px' }}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Text bold>Ảnh minh chứng *</Text>
                <Text size="small" style={{ color: photos.length === 0 ? '#ff4444' : '#999' }}>
                  {photos.length} / 5
                </Text>
              </div>
              <Text size="xSmall" style={{ color: '#666', marginBottom: '12px' }}>
                Yêu cầu tối thiểu 1 ảnh. Có thể thêm tối đa 5 ảnh.
              </Text>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      paddingTop: '100%',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        console.error('Image load error:', photo);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,0,0,0.8)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {photos.length < 5 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    variant="secondary" 
                    onClick={handleTakePhoto}
                    style={{ flex: 1 }}
                  >
                    📷 Chụp ảnh
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleChooseFromAlbum}
                    style={{ flex: 1 }}
                  >
                    🖼️ Thư viện
                  </Button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="card" style={{ marginTop: '16px' }}>
              <Text bold style={{ marginBottom: '8px' }}>
                Ghi chú / Báo cáo
              </Text>
              <Input.TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú về tình hình đối thủ, tồn kho..."
                rows={4}
              />
            </div>

            {/* Check-out button */}
            <div className="card" style={{ marginTop: '16px' }}>
              <Button
                className="btn-large btn-success"
                onClick={handleCheckOut}
                disabled={processing}
              >
                {processing ? 'Đang xử lý...' : 'CHECK-OUT & HOÀN THÀNH'}
              </Button>
            </div>
          </>
        )}
      </Box>
    </Page>
  );
};

export default VisitDetail;
