const types = {
    image: 'image',
    audio: 'audio',
    video: 'video',
    text: 'text',
    file: 'file'
};
const stickerTypes = {
  gif: 'gif',
  webp: 'webp',
};  

export function findFileType(type) {
    const split_type = type.split('/')
    const type_name = split_type[0];

    if (types.hasOwnProperty(type_name)) {
      const type_sticker = split_type[1];
      
      if(stickerTypes.hasOwnProperty(type_sticker)) return stickerTypes[type_sticker];
      return types[type_name];
    } else return types['file'];
}
  