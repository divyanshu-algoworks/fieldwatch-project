export const videosListUrl = "/api/v1/training_videos/index";
export const videoIFrameUrl = "https://fast.wistia.net/embed/iframe";

export const matchYoutubeUrl = (url) => {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

export const videoAudioFormats = [
  "webm",
  "mpg",
  "mp2",
  "mpeg",
  "mpe",
  "mpv",
  "ogg",
  "mp4",
  "m4p",
  "m4v",
  "avi",
  "wmv",
  "mov",
  "qt",
  "flv",
  "swf",
  "avchd",
  "mp4v",
  "3g2",
  "3gp2",
  "3gp",
  "3gpp",
  "m4a",
  "mov",
  "aac",
  "adt",
  "adts",
  "mpg",
  "mpeg",
  "m1v",
  "mp2",
  "mp3",
  "mpa",
  "mpe",
  "m3u",
  "wav",
  "wmz",
  "wms",
];
