/**
 * Provides the list of available profile pictures
 * Synchronized with the /public/avatars/ directory
 */
export default defineEventHandler(() => {
  return [
    { id: 'av-1', url: '/avatars/pere.jpg', label: 'Papa' },
    { id: 'av-2', url: '/avatars/mere.jpg', label: 'Maman' },
    { id: 'av-3', url: '/avatars/grand-pere.jpg', label: 'Grand-père' },
    { id: 'av-4', url: '/avatars/grand-mere.jpg', label: 'Grand-mère' },
    { id: 'av-5', url: '/avatars/enfant-m.jpg', label: 'Fils' },
    { id: 'av-6', url: '/avatars/enfant-f.jpg', label: 'Fille' }
  ];
});