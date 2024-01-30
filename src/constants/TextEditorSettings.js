export const DEFAULT_CONFIG = {
  modules : {
    toolbar: [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    ['link']  
    ],
    clipboard: {
      matchVisual: false,
    }
  }
};

export const NOTIFICATION_ALERTS_CONFIG = {
  modules : {
    toolbar: [['bold', 'italic', 'underline', 'strike'],        
    [{ 'header': 1 }, { 'header': 2 }],               
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          
    [{ 'size': ['small', false, 'large', 'huge'] }],  
    [{ 'color': [] }, { 'background': [] }],          
    [{ 'font': [] }],  
    ],
    clipboard: {
      matchVisual: false,
    }
  }
};

export const NOTICE_EDITOR_CONFIG = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link']
    ],
  },

  formats: [
    'bold', 'italic', 'underline',
    'link'
  ],
}

export const SIGNATURE_CONFIG={
  modules : {
    toolbar: [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    ['link']  
    ],
    clipboard: {
      matchVisual: false,
    }
  }
}
