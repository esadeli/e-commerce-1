'use strict'

const Item = require('../models/item')
const Category = require('../models/category')

class ItemController{
    //create item
    static createItem(req,res){
        Item.create({
            itemname: req.body.itemname,
            itemcategoryid: req.body.itemcategoryid,
            itemurlimage: req.body.itemurlimage,
            itemprice: Number(req.body.itemprice)
        })
          .then(item => {
            let itemcreated = item
            // update item to Category collection
            Category.findOneAndUpdate({
              _id: item.itemcategoryid  
            },{
                $push: {
                    listitemcategory:itemcreated._id 
                }
            })
              .then(category => {
                res.status(200).json({
                    msg: 'Item has been created',
                    data: itemcreated
                })
              })
              .catch(error => {
                res.status(500).json({
                    msg: 'ERROR Update Item to Category ',error
                })
              })
                 
          })
          .catch(error => {
              res.status(500).json({
                  msg: 'ERROR Create Item ',error
              })
          })
    }

    // get list of items
    static getItemLists(req,res){
        Item.find({})
         .then(items=>{
            res.status(200).json({
                msg: 'List of Items',
                data: items
            })
         })
         .catch(error =>{
             res.status(500).json({
                 msg: 'ERROR List Items ',error
             })
         })
    }

    // get details
    static getDetail(req,res){
        Item.findOne({
            _id: req.params.id
        })
          .then(item=>{
            res.status(200).json({
                msg: `Detail of item ${item.itemname}`,
                data: item
            })
          })
          .catch(error =>{
            res.status(500).json({
              msg: 'ERROR Detail Items ',error
            })
          })
    }

    // edit item
    static editItem(req,res){
        // validate Name, Category and urlimage
        if(req.body.itemname === '' || req.body.itemname === null || req.body.itemcategoryid === '' || req.body.itemcategoryid === null || req.body.itemurlimage === '' || req.body.itemurlimage === null){
            res.status(400).json({
               msg: 'Name, Category and Url image should not be empty' 
            })
        }else{
            let price = req.body.itemprice
            if(price<0){
               price = 0 
            }

            Item.findOne({
                _id: req.params.id
            })
            .then(item => {
                // check if there's any change in category
                if(item.itemcategoryid == req.body.itemcategoryid){
                    Item.findOneAndUpdate({
                        _id: req.params.id
                    },{
                        itemname: req.body.itemname,
                        itemcategoryid: req.body.itemcategoryid,
                        itemurlimage: req.body.itemurlimage,
                        itemprice: price
                    })
                    .then(itemupdated =>{
                        res.status(200).json({
                            msg: `Item has been updated`,
                            data: itemupdated
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            msg: 'ERROR Edit Items ',error
                        })            
                    })
                }else if(item.itemcategoryid != req.body.itemcategoryid){
                    // remove from old category
                    Category.findOneAndUpdate({
                        _id: item.itemcategoryid
                    },{
                        $pull: {
                            listitemcategory: req.params.id
                        }
                    })
                    .then(oldcategory=>{
                        // updating new category
                        Category.findOneAndUpdate({
                            _id:req.body.itemcategoryid
                        },{
                            $push: {
                                listitemcategory: req.params.id
                            }
                        })
                        .then(newcategory =>{
                            // update the item
                            Item.findOneAndUpdate({
                                _id: req.params.id
                            },{
                                itemname: req.body.itemname,
                                itemcategoryid: req.body.itemcategoryid,
                                itemurlimage: req.body.itemurlimage,
                                itemprice: req.body.itemprice
                            })
                            .then(itemupdated =>{
                                res.status(200).json({
                                    msg: `Item has been updated`,
                                    data: itemupdated
                                })
                            })
                            .catch(error => {
                                res.status(500).json({
                                    msg: 'ERROR Edit Items ',error
                                })            
                            })  
                        })
                        .catch(error =>{
                            res.status(500).json({
                            msg: 'ERROR Updating New Category ',error
                            })  
                        })
                    })
                    .catch(error =>{
                        res.status(500).json({
                            msg: 'ERROR Updating Old Category ',error
                        })          
                    })
                }
          })
          .catch(error => {
            res.status(500).json({
              msg: 'ERROR Edit Items ',error
            })
          })
        }
    }

    // delete item
    static deleteItem(req,res){
        Item.findOne({
           _id: req.params.id
        })
         .then(item => {
            let deleteditem = item 
            Category.findOneAndUpdate({
                _id: deleteditem.itemcategoryid
            },{
                $pull: {
                    listitemcategory: deleteditem._id
                }
            })
              .then(category => {
                  Item.findOneAndRemove({
                      _id: req.params.id
                  })
                    .then(itemdeleted=>{
                        res.status(200).json({
                            msg: 'Item has been deleted',
                            data: itemdeleted
                        })
                    })
                    .catch(error =>{
                        res.status(500).json({
                            msg: 'ERROR Delete Item from Category ',error
                        })      
                    })
              })
              .catch(error => {
                  res.status(500).json({
                      msg: 'ERROR Delete Item from Category ',error
                  })
              })
         })
         .catch(error => {
            res.status(500).json({
               msg: 'ERROR Delete Items ',error
            }) 
         })
    }

    // search item by keyword
    static searchItemByKeyword (req,res) {
        Item.find({})
         .then(items =>{
             let sortedArr = []
             let regex = new RegExp(`${req.body.keyword}`, 'i')

             items.forEach( item =>{
                if(regex.test(item.itemname)){
                    sortedArr.push(item)
                }
             })
            //  console.log('sorted arr--------',sortedArr)
             res.status(200).json({
                msg: 'List of sorted data',
                data: sortedArr 
             })
         })
         .catch(error => {
             res.status(500).json({
               msg: 'ERROR Search Item by Keyword in name: ',error
             })
         })
    }
}

module.exports = ItemController