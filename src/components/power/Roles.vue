<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
            <el-col>
                  <el-button type="primary" @click="AddRolesdialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
          <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
         <!-- stripe: 斑马条纹
        border：边框-->
        <!-- 展开列 type=expand -->
        <el-table-column type="expand">
          <template slot-scope="scope">
              <el-row 
               :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1,index1) in scope.row.children" :key="item1.id">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                   <el-tag  closable @close="removeRightById(scope.row, item1.id)"> {{item1.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                </el-col >

                  <!-- 渲染二和三级权限 -->
                 <el-col :span="19">
                      <!-- 通过for循环 渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                 <!-- closable一个x号 -->
                  <el-col :span="6 ">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)" >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag  type="warning" v-for="(item3) in item2.children" :key="item3.id"  closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName}}</el-tag>
                  </el-col>

                </el-row>
                </el-col>
              </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
         <el-table-column label="操作" widh=180px>
           <template slot-scope="scope"> 
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
           </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色框 -->
    <el-dialog title="添加角色" :visible.sync="AddRolesdialogVisible" width="50%" @close="addRoleDialogClosed">
   <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="AddRolesdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
</el-dialog>

      <!-- 编辑角色 -->
          <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleDialogClosed">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
        <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed">
      <!-- 
        show-checkbox添加复选框
        default-expand-all默认打开全部节点
        :default-checked-keys="defKeys"默认被选中的数组 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
        //所有角色列表数据
        rolelist:[],
       // 权限列表
      rightsList: [],
        // 添加角色表单
        addRoleForm:{},
        //编辑表单
        editRoleForm:{},
   //  树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //   默认选中节点ID值
      defKeys: [],
       //   当前即将分配权限的Id
      roleId: 0,
        // 添加框的显示和隐藏
        AddRolesdialogVisible:false,
          // 修改框的显示和隐藏
        editRoleDialogVisible:false,
           // 分配权限框的显示和隐藏
        setRightDialogVisible:false,
           //   添加角色表单验证
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editRoleFormRules:{
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
         roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    };
  },
  created(){
     this.getRolesList()
  },
  methods:{
     //获取所有角色的列表
     async getRolesList(){
         const {data:res}=await this.$axios.get('roles')
        if(res.meta.status!==200){
            return this.$message.error('获取角色列表失败')
        }
        this.rolelist=res.data
        // console.log(this.rolelist)
     },
        // 重置添加角色对话框的关闭
    addRoleDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    //重置编辑角色对话框
    editRoleDialogClosed(){
      this.$refs.editRoleFormRef.resetFields()
    },
    // 权限对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
        // 根据ID删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框提示 删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消权限删除')
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      role.children = res.data
      //   不建议使用
      // this.getRolesList()
    },
      // 添加角色
    addRoles () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.AddRolesdialogVisible = false
        this.getRolesList()
      })
    },
    //点击编辑按钮
     async showEditDialog (id) {
      const { data: res } = await this.$axios.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 实现编辑功能
        editRoles () {
      this.$refs.editRoleFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$axios.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败！')
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false
        this.$message.success('更新角色信息成功！')
        this.getRolesList()
      })
    },
  // 删除角色
    async removeRoleById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$axios.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除用户成功！')
      this.getRolesList()
    },
     // 分配权限
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取角色的所有权限
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      //   获取权限树
      this.rightsList = res.data
      //   console.log(res)
      //   递归获取三级节点的id
      this.getLeafkeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
     // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
     // 循环node里的children数组，每循环一项拿到一个子节点item，在根据item再次调用递归函数getLeafKeys，
      // 然后把当前的item当做一个节点传进去，同时把arr传进去。只要递归完毕后，就把三级节点的id都保存到arr了
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },    
    // 分配权限
    async allotRights (roleId) {
      // 获得当前选中和半选中的Id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('分配权限失败！') }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>