import { Track } from "@kyflx-dev/lavalink-types";

import { Playlist } from "../../lib";
import { YoutubeSong } from "./Song";
import { YTAPI } from "../../../../../core/";
import { PlaylistInfo } from "../../../../util";

export class YoutubePlaylist extends Playlist {
  public uri: string;
  public color = 0xff0000;

  public constructor(data: PlaylistInfo, tracks: Track[]) {
    super(data, tracks);
    this.uri = `https://www.youtube.com/playlist?list=${this.identifier}`;
  }

  public async load(api: YTAPI) {
    this.songs = await Promise.all(
      this.tracks.map((t) => new YoutubeSong(t).load(api))
    );

    const playlist = await api.playlist(this.identifier);
    if (playlist) {
      this.title = playlist.title;
      this.description = playlist.description;
      this.artwork = playlist.artwork;
    }

    return this;
  }
}
