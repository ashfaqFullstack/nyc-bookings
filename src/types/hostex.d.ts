// TypeScript declarations for Hostex custom elements

declare namespace JSX {
  interface IntrinsicElements {
    'hostex-search-widget': {
      'result-url'?: string;
      id?: string;
    };
    'hostex-booking-widget': {
      'listing-id'?: string;
      id?: string;
    };
    'hostex-search-result-widget': {
      id?: string;
    };
  }
}

// Global declarations for the custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hostex-search-widget': {
        'result-url'?: string;
        id?: string;
      };
      'hostex-booking-widget': {
        'listing-id'?: string;
        id?: string;
      };
      'hostex-search-result-widget': {
        id?: string;
      };
    }
  }
}

export {};
