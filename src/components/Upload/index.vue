<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      class="image-uploader"
      :action="apiurl"
      :headers="headers"
      :on-success="success"
      :on-error="error"
      :before-upload="beforeUpload"
    >
      <el-button size="small" type="primary">{{$t('upload.clickUpload')}}</el-button>
      <div slot="tip" class="el-upload__tip">{{$t('upload.tip')}}</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      dataObj: { moduleId: "", moduleName: "" },
      headers: {
        Authorization: `xytoken_${getToken("Token")}`,
      },
    };
  },
  computed: {
    apiurl() {
      return process.env.VUE_APP_BASE_API + "/accessory/upload";
    },
  },
  methods: {
    success(response, file, fileList) {
      this.$emit("success", response);
    },
    error(err, file, fileList) {
      this.$message.error($t('upload.error'));
    },
    beforeUpload(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.$message.error($t('upload.sizeError'));
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-upload__tip {
  display: inline;
  margin-left: 20px;
}
</style>