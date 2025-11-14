
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface Source {
  uri: string;
  title: string;
}

export interface SavedSearch {
  id: string;
  timestamp: string;
  query: string;
  response: string;
  sources: Source[];
  notes: string;
}
