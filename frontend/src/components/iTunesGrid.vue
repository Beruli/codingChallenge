<template>
  <div>
    <h2 class="title"> Miley Cyrus albums:</h2>

    <div v-if="!errorMsg" class="filter">
      <label for="filter">Album filter: </label>
      <input id="filter" v-model="filterText" @keyup="filterAlbums">
    </div>

    <div v-if="errorMsg" class="loadError">
      Error loading albums: {{ errorMsg }}
    </div>

    <div v-if="albums.length > 0">
      <div v-for="(item, index) in filteredAlbums" :key="index">
        <div v-if="index === 0" class="row header">
          <div class="column album">
            <h2>Album title</h2>
          </div>
          <div class="column thumbnail">
            <h2>Thumbnail</h2>
          </div>
        </div>
        <div class="row">
          <div class="column album content">
            <h3>{{ item.album }}</h3>
          </div>
          <div class="column thumbnail content">
            <img :src="`${item.thumbnail}`" alt="No image available">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "http";

export default {
  name: 'iTunesGrid',
  data() {
    return {
      albums: [],
      filteredAlbums: [],
      filterText: '',
      errorMsg: ''
    };
  },
  created: function () {
    http.get('http://localhost:8765/codechallenge', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        this.albums = JSON.parse(data);
        this.filteredAlbums = this.albums;
      });
    }).on('error', (err) => {
      this.errorMsg = err.message;
    });
  },
  methods: {
    filterAlbums: function () {
      if (this.filterText) {
        this.filteredAlbums = Array.from(this.albums).filter((item) => (item?.album.includes(this.filterText)));
      } else {
        this.filteredAlbums = this.albums;
      }
    }
  }
}
</script>

<style>

.header {
  border-style: solid;
  border-width: 10px;
  width: 725px;
  height: 100px;
  text-align: center;
  margin-top: 50px;
}

.column {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.thumbnail {
  width: 200px;
  height: 100px;
}

.album {
  width: 500px;
  height: 100px;
  text-align: left;
  overflow: hidden;
}

.row {
  display: flex;
  flex-direction: row;
}

img {
  width: 100px;
  height: 100px;
  display: block;
  margin: auto;
}

.title {
  text-align: left;
}

.content {
  border-style: solid;
  border-width: 1px;
}

.loadError {
  color: red;
}
</style>
