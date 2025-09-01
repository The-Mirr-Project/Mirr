import { $mirr } from "../../config";
function unrewriteUrl(url) {
  url = url.slice($mirr.prefix.length);
}

export default unrewriteUrl;
