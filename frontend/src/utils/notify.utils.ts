import toastr from 'toastr';

toastr.options = {
   closeButton: false,
   debug: false,
   newestOnTop: true,
   progressBar: false,
   positionClass: 'toast-top-right', 
   showDuration: 300,
   hideDuration: 1000,
   timeOut: 3000,
   extendedTimeOut: 1000,
   showEasing: 'swing',
   hideEasing: 'linear',
   showMethod: 'fadeIn',
   hideMethod: 'fadeOut',
};

export const notify = {
   success: (message: string, title?: string): void => {
      toastr.success(message, title);
   },
   error: (message: string, title?: string): void => {
      toastr.error(message, title);
   },
   warning: (message: string, title?: string): void => {
      toastr.warning(message, title);
   },
   info: (message: string, title?: string): void => {
      toastr.info(message, title);
   },
};