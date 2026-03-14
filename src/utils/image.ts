import { chooseImage, authorize } from 'zmp-sdk';

/**
 * Compress and resize image file
 * @param file - Original image file
 * @param maxWidth - Maximum width (default: 1024px)
 * @param maxHeight - Maximum height (default: 1024px)
 * @param quality - JPEG quality 0-1 (default: 0.8)
 * @returns Compressed image file
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Create new file from blob
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, '.jpg'), // Convert to .jpg
              {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }
            );
            
            const originalSize = (file.size / 1024).toFixed(2);
            const compressedSize = (compressedFile.size / 1024).toFixed(2);
            const reduction = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1);
            
            console.log(`📦 Compressed: ${originalSize}KB → ${compressedSize}KB (↓${reduction}%)`);
            console.log(`📐 Resized: ${img.width}x${img.height} → ${width}x${height}`);
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Request camera/photo permission
 */
const requestPhotoPermission = async (): Promise<boolean> => {
  try {
    console.log('🔐 Requesting photo permission...');
    const result = await authorize({
      scopes: ['scope.userPhotos']
    });
    console.log('✅ Permission result:', result);
    return true;
  } catch (error) {
    console.error('❌ Permission denied or error:', error);
    return false;
  }
};

/**
 * Choose images from camera or gallery
 */
export const selectImages = async (maxSelect: number = 5, sourceType: ('camera' | 'album')[] = ['camera', 'album']): Promise<string[]> => {
  console.log('📸 selectImages called - max:', maxSelect, 'source:', sourceType);
  
  // Request permission first
  await requestPhotoPermission();
  
  // Try Zalo SDK first
  try {
    console.log('📱 Trying Zalo SDK chooseImage...');
    const result = await chooseImage({
      count: maxSelect,
      sourceType: sourceType,
      cameraType: 'back',
    });
    
    console.log('✅ Zalo SDK success:', result);
    const paths = result.tempFilePaths || [];
    console.log('✅ Got', paths.length, 'images from Zalo SDK');
    return paths;
  } catch (error) {
    console.error('❌ Zalo SDK failed:', error);
    console.log('🔄 Trying browser fallback...');
    
    // Fallback to HTML input file for browser/dev environment
    return new Promise((resolve, reject) => {
      try {
        console.log('🌐 Creating file input element...');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = maxSelect > 1;
        
        // Try different positioning strategies
        input.style.position = 'absolute';
        input.style.left = '0';
        input.style.top = '0';
        input.style.width = '1px';
        input.style.height = '1px';
        input.style.opacity = '0.01';
        input.style.zIndex = '-1';
        
        let hasResponded = false;
        let changeEventFired = false;
        
        const cleanup = () => {
          console.log('🧹 Cleaning up input element');
          setTimeout(() => {
            if (input.parentNode) {
              input.parentNode.removeChild(input);
            }
          }, 1000);
        };
        
        input.addEventListener('change', async (e: Event) => {
          changeEventFired = true;
          console.log('📸 ✅ CHANGE EVENT FIRED!');
          
          if (hasResponded) {
            console.log('⚠️ Already responded, ignoring');
            return;
          }
          hasResponded = true;
          
          console.log('📸 Input change event fired');
          const target = e.target as HTMLInputElement;
          const files = target.files;
          
          if (!files || files.length === 0) {
            console.log('⚠️ No files selected');
            cleanup();
            resolve([]);
            return;
          }
          
          console.log('📸 Files selected:', files.length);
          const fileArray = Array.from(files).slice(0, maxSelect);
          
          try {
            const imageUrls: string[] = [];
            
            for (let i = 0; i < fileArray.length; i++) {
              const file = fileArray[i];
              console.log(`📸 Reading file ${i + 1}/${fileArray.length}:`, file.name);
              
              const url = await new Promise<string>((resolveRead, rejectRead) => {
                const reader = new FileReader();
                reader.onload = () => resolveRead(reader.result as string);
                reader.onerror = () => rejectRead(new Error('Failed to read file'));
                reader.readAsDataURL(file);
              });
              
              imageUrls.push(url);
              console.log(`✅ File ${i + 1} converted to data URL`);
            }
            
            console.log('✅ All files processed:', imageUrls.length);
            cleanup();
            resolve(imageUrls);
          } catch (err) {
            console.error('❌ Error processing files:', err);
            cleanup();
            reject(err);
          }
        });
        
        input.addEventListener('cancel', () => {
          if (hasResponded) return;
          hasResponded = true;
          console.log('⚠️ USER CANCELLED FILE SELECTION');
          cleanup();
          resolve([]);
        });
        
        // Add focus/blur listeners to detect interaction
        input.addEventListener('focus', () => {
          console.log('🔍 Input got focus');
        });
        
        input.addEventListener('blur', () => {
          console.log('🔍 Input lost focus');
          // If blur happens without change, user likely cancelled
          setTimeout(() => {
            if (!changeEventFired && !hasResponded) {
              console.log('⚠️ Blur without change - likely cancelled');
              hasResponded = true;
              cleanup();
              resolve([]);
            }
          }, 500);
        });
        
        // Timeout fallback
        setTimeout(() => {
          if (!hasResponded) {
            console.log('⏱️ TIMEOUT - No response after 60s');
            console.log(`   - Change event fired: ${changeEventFired}`);
            hasResponded = true;
            cleanup();
            resolve([]);
          }
        }, 60000); // 60 seconds timeout
        
        document.body.appendChild(input);
        console.log('✅ Input added to DOM');
        console.log('🖱️ Triggering click...');
        
        // Try multiple ways to trigger
        try {
          // Method 1: Direct click with delay
          setTimeout(() => {
            console.log('🖱️ Method 1: Calling input.click()...');
            input.click();
            console.log('✅ input.click() called');
            
            // Method 2: Dispatch click event as backup
            setTimeout(() => {
              if (!changeEventFired) {
                console.log('🖱️ Method 2: Dispatching click event...');
                const clickEvent = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true
                });
                input.dispatchEvent(clickEvent);
                console.log('✅ Click event dispatched');
              }
            }, 500);
          }, 100);
        } catch (clickError) {
          console.error('❌ Error triggering click:', clickError);
          hasResponded = true;
          cleanup();
          reject(clickError);
        }
        
      } catch (err) {
        console.error('❌ Error in fallback:', err);
        reject(err);
      }
    });
  }
};

/**
 * Convert base64 to blob
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
};

/**
 * Get file name from path
 */
export const getFileName = (path: string): string => {
  return path.split('/').pop() || '';
};
