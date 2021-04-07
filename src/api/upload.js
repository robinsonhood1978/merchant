import { _post } from './index';

//上传图片
export const upload = data => {
  let formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  let req = {
    data: formData,
    url: 'manage/upload_img'
  };
  return _post(req);
};

//上传图片
export const uploadPhotos = data => {
  let formData = new FormData();
  for (let i = 0; i < data.files.length; i++) {
    formData.append('files', data.files[i]);
  }
  let req = {
    data: formData,
    url: 'manage/upload_photos'
  };
  return _post(req);
};
