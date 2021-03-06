Vue.component('sidebar-section',{
    template: 
      ` <div>
            <div v-if= "getislogin === true " id="welcomemessage" >
                <p style= "color: black">Welcome {{ usercredentials.name }} </p>
            </div>
            <div id="searchbar">
                <input class="form-control mr-sm-2" type="text" v-model= "searchkeyword" placeholder="Search" aria-label="Search">
                <hr>
                <button class="btn btn-outline-success my-2 my-sm-0" type="button" v-on:click= "getitembysearch()">Search</button>
            </div>
            <h3 class="my-4">Categories</h3>
            <div class="list-group">
                <button class="list-group-item sideBarCustom" v-on:click="getallitems()" >All Items</button> 
            </div>
            <div class="list-group">
                <button v-for="category in listcategories" class="list-group-item sideBarCustom" v-on:click= "getitembycategory(category._id)">{{ category.name }}</button>    
            </div>
            <hr>
            <div class="list-group" v-if="getislogin === true && usercredentials.role === 'admin' ">
              <h3>Admin Section</h3>
              <button class="btn btn-success my-2 my-sm-0" type="button" data-toggle="modal" data-target="#createItem" >Add Item</button>
              <br>  
              <button class="btn btn-success my-2 my-sm-0" type="button" data-toggle="modal" data-target="#createCategory" >Add Category</button>  
            </div>

            <!-- Modal part -->
            <!-- create item modal -->
            <div class="modal fade" id="createItem" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create Item</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>    
                        <div class="modal-body">
                            <div id="errcreateitem"></div>
                            <form>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Name</label>
                                    <input type="text" v-model="itemname" class="form-control" aria-describedby="emailHelp" placeholder="Enter Item Name" required>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Category</label>
                                    <select v-model="itemcategory">
                                        <option disabled value="">Please select one</option>
                                        <option v-for="category in listcategories" v-bind:value = "category._id" >{{ category.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Image</label>
                                    <input type="file" v-on:change="getimage" class="form-control" id="file" ref="file" placeholder="Upload Image">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Price</label>
                                    <input type="text" v-model="itemprice" class="form-control" placeholder="Price">
                                </div>
                            </form>
                            <br/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" v-on:click="createitem()" >Create Item</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- create category modal -->
            <div class="modal fade" id="createCategory" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create Category</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <div id="errcreatecategory"></div>
                            <form>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Name</label>
                                    <input type="text" v-model="categoryname" class="form-control" aria-describedby="emailHelp" placeholder="Enter Category Name" required>
                                </div>
                            </form>
                            <br/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" v-on:click="createcategory()" >Create Category</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `,
    props: ['getcredentials','getislogin','token'],  
    data () {
       return {
        listitems: [],
        listcategories: [],
        searchkeyword: '',
        usercredentials: {},
        itemname: '',
        itemcategory: '',
        itemurlimage: '',
        itemprice: 0,
        imageupload: '',
        categoryname: ''
       } 
    },
    methods: {
      // get all items 
      getallitems () {
        let self = this  
        axios({
          method: 'GET',
          url: 'https://apiecosmetics.efratsadeli.online/items/lists'       
        })
          .then(items => { 
            self.listitems = items.data.data
          })
          .catch(error => {
             console.log('ERROR Get List of Items', error)     
          })  
      },
      // get item by category
      getitembycategory (input) {
        let self = this
        let categoryid = input  
        axios({
            method: 'GET',
            url: `https://apiecosmetics.efratsadeli.online/categories/${categoryid}`
        })
         .then(categories => {
            self.listitems = categories.data.data.listitemcategory
         })
         .catch(error =>{
            console.log('ERROR Get List of Categories', error)  
         })
      },
      // get item by search
      getitembysearch (){
         let self = this
         let key = this.searchkeyword
         axios({
           method: 'POST',
           url: 'https://apiecosmetics.efratsadeli.online/items/search',
           data: {
              keyword: key    
           }    
         })
           .then(searchitems => {
             self.listitems = searchitems.data.data  
           })
           .catch(error =>{
             console.log('ERROR Get Search result', error) 
           })
      },
      // get image 
      getimage () {
        // console.log('By Ref------', this.$refs.file.files) 
        this.imageupload = this.$refs.file.files[0] 
      },
      // create new item 
      createitem () {
         let self = this   
         console.log('ITEM PRICE CREATE------', this.itemprice )
         // validate price
         if(this.itemprice < 0 || this.itemprice === undefined || this.itemprice === null){
             this.itemprice = 0
         }

         // validate name and category
         if(this.itemname === '' || this.itemcategory === ''){
            $('#errcreateitem').empty()
            $('#errcreateitem').append(
                 `<div>
                 <button type="button" class="btn btn-danger">
                    ERROR: Name and or Category should not be empty 
                 </button> 
                 </div>`
            )
            setTimeout( ()=>{
                 $('#errcreateitem').empty()   
            },3000)
            return
         }

         // upload data to GCP first
         let upladdata = new FormData()
         upladdata.append('imagefile',this.imageupload)
        //  console.log('Upload access----')
         axios.post('https://apiecosmetics.efratsadeli.online/items/uploads', upladdata,
         {
           headers: {
            'Content-Type': 'multipart/form-data',
            'token': self.token 
           }  
         })
           .then(uploadresult => {
               self.itemurlimage = uploadresult.data.link
            //    console.log('Upload Sukses---', uploadresult.data.link) 

               // create item
               axios({
                  method: 'POST',
                  url: 'https://apiecosmetics.efratsadeli.online/items',
                  headers:{
                    token: self.token 
                  },
                  data: {
                    itemname: self.itemname,
                    itemcategoryid: self.itemcategory,
                    itemurlimage: self.itemurlimage,
                    itemprice: self.itemprice
                  }
               })
                .then(item =>{
                //    console.log('Item created-----', item.data.data) 

                    // get lists of item
                    axios({
                      method: 'GET',
                      url: 'https://apiecosmetics.efratsadeli.online/items/lists'   
                    })
                     .then(items => {
                        self.listitems = items.data.data 

                        // empty all unnecessary variable
                        self.itemname= '',
                        self.itemcategory= '',
                        self.itemurlimage= '',
                        self.itemprice= 0,
                        self.imageupload= ''

                        // close modal
                        $('#createItem').modal('hide')
                     })
                     .catch(error =>{
                        console.log('ERROR Get List items after create ',error)  
                     })
                })
                .catch(error =>{
                   console.log('ERROR Create Item  ', error.response)
                   $('#errcreateitem').empty()
                   $('#errcreateitem').append(
                        `<div>
                        <button type="button" class="btn btn-danger">
                            Name and or Category should not be empty 
                        </button> 
                        </div>`
                   )
                   setTimeout( ()=>{
                        $('#errcreateitem').empty()   
                   },3000) 
                })
           })
           .catch(error =>{
            //    console.log('ERROR Upload Create ',error.response.data)
               console.log('ERROR Upload Create ',error)
               $('#errcreateitem').empty()
               $('#errcreateitem').append(
                   `<div>
                   <button type="button" class="btn btn-danger">
                       Upload file should be in .jpg, .jpeg or .png 
                   </button> 
                   </div>`
               )
               setTimeout( ()=>{
                   $('#errcreateitem').empty()   
               },3000)
           })
      },
      // create category
      createcategory () {
        let self = this

        // validate name 
        if(this.categoryname === ''){
            $('#errcreatecategory').empty()
            $('#errcreatecategory').append(
                 `<div>
                 <button type="button" class="btn btn-danger">
                    ERROR: Name should not be empty 
                 </button> 
                 </div>`
            )
            setTimeout( ()=>{
                 $('#errcreatecategory').empty()   
            },3000)
            return
         }
        axios({
           method: 'POST',
           url: 'https://apiecosmetics.efratsadeli.online/categories',
           headers: {
             token: self.token  
           },
           data: {
              name: self.categoryname  
           } 
        })
          .then(category => {
             // update all category
             axios({
                method: 'GET',
                url: 'https://apiecosmetics.efratsadeli.online/categories/lists'  
             })
              .then(categories => {
                self.listcategories = categories.data.data
                $('#createCategory').modal('hide')
              })
              .catch(error =>{
                console.log('ERROR Get Category after create new category ',error)       
              })
          })
          .catch(error =>{
             console.log('ERROR Create Category ',error)
             $('#errcreatecategory').empty()
             $('#errcreatecategory').append(
                 `<div>
                   <button type="button" class="btn btn-danger">
                     Name should not be empty 
                   </button> 
                 </div>`
             )
             setTimeout( ()=>{
               $('#errcreatecategory').empty()   
             },3000)
          })
      }
    },
    created () {
      let self = this

      // get list of categories
      axios({
        method: 'GET',
        url: 'https://apiecosmetics.efratsadeli.online/categories/lists' 
      })
       .then(categories =>{
          self.listcategories = categories.data.data
        })
       .catch(error=>{
           console.log('ERROR Get Category ',error)
       })  
    },
    watch: {
       listitems (val){
          this.$emit('listitems',val)
       },
       listcategories (val){
          this.$emit('listcategories',val)
       },
       getcredentials (val) {
          this.usercredentials = val 
       }
    } 
})