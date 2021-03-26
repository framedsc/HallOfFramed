import { createContext } from 'react';

export const ModalContext = createContext({show: false, component: null, className:'', withClose: true})
export const SiteDataContext = createContext(
  {
    imageData: [], 
    authorData: [],
    searchData: {}
  }
)