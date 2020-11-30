<template>
  <div>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false">
      </el-alert>
      <el-steps :active="Number(tabIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs tab-position="left" v-model="tabIndex" @tab-click="clickTab" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类(只支持三级分类)" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                style="width: 100%">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, index) in item.attr_vals" :key="index" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-dialog title="图片预览" :visible.sync="picPreviewDialogVisible" width="50%" @close="picPreviewClosed">
              <img :src="picPath" alt="商品图片" style="width: 100%">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" style="margin-top: 15px;float: right" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getCategoriesList, getParamsList, addGoods } from "@/api/goods";

  export default {
  data(){
    return{
      tabIndex: 0,
      cateId: '',
      addForm: {
        goods_name: '',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      picPreviewDialogVisible: false,
      picPath: ''
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      getCategoriesList().then(res => {
        this.cateList = res.data;
      })
    },
    clickTab() {
      if(this.tabIndex === '1' || '4'){
        this.getParamsList('many');
      }else if(this.tabIndex === '2' || '4'){
        this.getParamsList('only');
      }
    },
    getParamsList(type) {
      getParamsList(this.cateId, {sel: type}).then(res => {
        if(this.tabIndex === '1' || '4'){
          res.data.forEach(item => {
            if(item.attr_vals.indexOf(',') !== -1){
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
            }else{
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
            }
          });
          this.manyTableData = res.data;
        }else if(this.tabIndex === '2' || '4'){
          this.onlyTableData = res.data;
        }
      })
    },
    beforeTabLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先输入商品信息');
        return false;
      }
    },
    handleChange() {
      if(this.addForm.goods_cat.length === 3){
        this.cateId = this.addForm.goods_cat[2];
      }else{
        this.addForm.goods_cat = [];
      }
    },
    handlePreview(file) {
      this.picPreviewDialogVisible = true;
      this.picPath = file.response.data.url;
    },
    handleRemove(file) {
      this.addForm.pics = this.addForm.pics.filter(item => item.pic!==file.response.data.tmp_path);
    },
    handleSuccess(res) {
      const pic = {pic: res.data.tmp_path};
      this.addForm.pics.push(pic);
    },
    picPreviewClosed() {
      this.picPath = '';
    },
    addGoods() {
      this.$refs.addFormRef.validate(valid => {
        if(!valid){
          this.$message.error('请填写商品基本信息');
          this.tabIndex = '0';
          return;
        }
        this.addForm.goods_cat = this.addForm.goods_cat.join(',');
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          };
          this.addForm.attrs.push(newInfo);
        });
        addGoods(this.addForm).then(res => {
          this.$router.replace('/goods');
          this.$message.success(res.meta.msg);
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-checkbox{
    margin: 0 10px 0 0 !important;
  }
</style>