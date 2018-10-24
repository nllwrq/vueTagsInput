<template>
    <div class="tags" @click="focusInput">
            <span class="tag" v-for="tag,index in tags"  @click.stop="" >
                <label @dblclick="editTag" @blur="editTagOver($event, index)" @keydown.enter.stop="editTagEnter">{{tagKey?tag[tagKey]:tag}}</label>
                <a href="javascript:;" class="el-icon-close" @click="removeTag(index)"></a>
            </span>
        <input ref="tagInput"
               v-model="newTagText"
               :placeholder="placeholder"
               @keydown.delete.stop = "removeTag('last')"
               @keydown.enter.stop = "addTag"
               @blur = "addTag('blur')"
        />
    </div>

</template>

<script>
    export default {
        props: {
            /*标签是否为只读*/
            readOnly: {
                type: Boolean,
                default: true
            },
            /*标签数组*/
            tags: {
                type: Array,
                default: []
            },
            /*显示标签的指定key值*/
            tagKey: {
                type: String,
                default: undefined
            },
            /*是否限制重复value*/
            limitSameValue: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                newTagText: ''
            }
        },
        mounted(){},
        methods: {
            addTag(type){
                if (this.limitSameValue && this.isSameValue(this.newTagText)) return;
                /*
                 10421 【③提升用户体验】在关键字写完没输入回车情况下，直接点击传稿报没有关键字错误
                 失去焦点也要添加关键字
                * */
                if (type === 'blur' && this.newTagText === '') return;
                if (this.tagKey){
                    const newObj = {};
                    newObj[this.tagKey] = this.newTagText;
                    this.tags.push(newObj)
                } else {
                    this.tags.push(this.newTagText)
                }
                this.newTagText = '';
            },
            removeTag(index){
                if (typeof index  === 'number'){
                    this.tags.splice(index, 1);
                } else {
                    if (this.newTagText.length > 0) return;
                    this.tags.pop();
                }
            },
            editTag(e){
                if (this.readOnly) return;
                const $label = e.target,
                $tag = $label.parentElement;
                $label.contentEditable = 'plaintext-only';
                $label.focus();
                $tag.dataset.editing = true;
            },
            editTagOver(e, index){
                const $this = e.target,
                    newTagText = $this.innerText,
                    $tag = $this.parentElement;
                $this.contentEditable = false;
                delete $tag.dataset.editing;
                if (this.limitSameValue && this.isSameValue(newTagText)) return;
                if (this.tagKey){
                    const newObj = this.tags[index];
                    newObj[this.tagKey] = newTagText;
                    this.tags.splice(index, 1, newObj)
                } else {
                    this.tags.splice(index, 1, newTagText)
                }
            },
            editTagEnter(e){
                e.target.blur()
            },
            isSameValue(value){
                for (let i = 0, max = this.tags.length; i < max; i++){
                    if (this.tagKey){
                        if (this.tags[i][this.tagKey] === value){
                            return true
                        }
                    } else {
                        if (this.tags[i] === value){
                            return true
                        }
                    }
                }
                return false
            },
            focusInput(e){
                this.$refs.tagInput.focus();
                e.preventDefault();
            },
            inputBlur(){
                console.log(111)
            }
        }
    }
</script>

<style scoped lang="scss">
    .tags{
        padding-bottom: 2px ;
        border:1px solid #f1faff;
        input{
            border: none;  outline: none;
            margin-left: 2px;
        }
        .tag{
            display: inline-block;
            background: #f1faff;  color: #1884fd;
            padding:0 5px; margin: 2px 0 0 2px;
            border-radius: 4px;  border: 1px solid transparent;
            font-size: 12px; height: 24px;  line-height: 24px;
            label{
                user-select: none;
            }
            a{
                transform: scale(.5);
            }
            &[data-editing]{
                background: none; color: #000;
                label{
                    display: inline-block;
                    height:100%;
                    outline: none;
                }
                a{
                    display: none;
                }
            }
        }
    }
</style>