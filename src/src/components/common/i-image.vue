<template>
  <div class="container" v-loading="loading">
    <div class="file-box">
      <el-button class="add-btn" @click="addImg" type="primary" icon="el-icon-plus"></el-button>
      <span v-show="ImagePath">{{ImagePath}}</span>
      <el-button v-show="ImagePath" @click="deleteImg" class="delete-btn" type="danger" icon="el-icon-delete"></el-button>
    </div>
    <input style="display:none" id="file" ref="file" type="file" value="" name="imageFile" @change="fileChange($event)"/>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'i-image',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ImagePath: '',
      loading: false
    }
  },
  watch: {
    value: {
      handler (value) {
        this.ImagePath = value

        if (!value) {
          document.getElementById('file').value = ''
        }
      },
      deep: true
    }
  },
  methods: {
    openImg () {
      window.open(this.ImagePath)
    },
    addImg () {
      this.$refs.file.click()
    },
    deleteImg () {
      this.ImagePath = ''
      this.$emit('input', this.ImagePath)
    },
    fileChange (event) {
      if (event.target.files.length) {
        this.loading = true
        let form = new FormData()
        let imgFile = document.getElementById('file').files[0]
        form.append('file', imgFile, imgFile.name) // 通过append向form对象添加数据
        form.append('access_token', JSON.parse(sessionStorage.getItem('userInfo')).access_token) // 通过append向form对象添加数据

        axios({
          method: 'post',
          url: 'http://305n9f4179.qicp.vip/pc/upload/uploadImage',
          data: form,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(data => {
          this.loading = false
          this.ImagePath = data.data.data
          this.$emit('input', this.ImagePath)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.ImagePath = ''
        this.$emit('input', this.ImagePath)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .file-box {
    display: flex;
    justify-content: space-between;

    .add-btn {
      padding: 0 10px;
    }

    span:nth-child(2) {
      flex: 1;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      padding: 0 5px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        color: #409EFF;
      }
    }

    .delete-btn {
      padding: 0 10px;
    }
  }
}
</style>
