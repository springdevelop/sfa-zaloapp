import { setStorage, getStorage, removeStorage } from 'zmp-sdk';
import { Visit } from '../state/atoms';
import { visitService } from './visitService';

const CURRENT_VISIT_KEY = 'current_visit';

export const currentVisitService = {
  /**
   * Save current visit to storage
   */
  saveCurrentVisit: async (visit: Visit): Promise<void> => {
    try {
      await setStorage({ data: { [CURRENT_VISIT_KEY]: visit } });
      console.log('✅ Saved current visit to storage:', visit.id);
    } catch (error) {
      console.error('❌ Error saving current visit:', error);
    }
  },

  /**
   * Get current visit - Try backend first, then local storage
   */
  getCurrentVisit: async (): Promise<Visit | null> => {
    try {
      // Try to get from backend first (source of truth)
      console.log('🔍 Checking backend for current visit...');
      const backendVisit = await visitService.getCurrentVisit();
      
      if (backendVisit) {
        console.log('✅ Found current visit from backend:', backendVisit.id);
        // Save to local storage for offline access
        await currentVisitService.saveCurrentVisit(backendVisit);
        return backendVisit;
      }
      
      // Backend returned null = no active visit
      // Clear local storage to sync with backend
      console.log('ℹ️ Backend has no active visit - clearing local storage');
      await currentVisitService.clearCurrentVisit();
      return null;
    } catch (error) {
      console.error('❌ Error getting current visit from backend:', error);
      
      // Fallback to local storage only on network error
      try {
        console.log('⚠️ Network error - using local storage fallback');
        const result = await getStorage({ keys: [CURRENT_VISIT_KEY] });
        const localVisit = result[CURRENT_VISIT_KEY];
        if (localVisit) {
          console.log('⚠️ Using cached visit:', localVisit.id);
          return localVisit;
        }
      } catch (storageError) {
        console.error('❌ Storage fallback also failed:', storageError);
      }
      
      return null;
    }
  },

  /**
   * Clear current visit from storage
   */
  clearCurrentVisit: async (): Promise<void> => {
    try {
      await removeStorage({ keys: [CURRENT_VISIT_KEY] });
      console.log('✅ Cleared current visit from storage');
    } catch (error) {
      console.error('❌ Error clearing current visit:', error);
    }
  },
};
