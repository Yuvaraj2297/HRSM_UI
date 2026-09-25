export const environment = {
  production: false,

  /** Base URL for backend API calls */
  apiUrl: '',

  /** Folder holding the static JSON data files (served from /public) */
  jsonPath: 'assets/json/',

  /** Map tile provider used by Leaflet maps */
  mapTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  mapAttribution: '&copy; OpenStreetMap contributors',
};
