<template>
    <div class="tags" @click="focusInput">
            <span class="tag" v-for="tag, index in tags"  @click.stop="" >
                <label @dblclick="editTag" @blur="editTagOver($event, index)">{{tag[tagKey]}}</label>
                <a href="javascript:;" class="el-icon-close" @click="removeTag(index)"></a>
            </span>
        <input ref="tagInput"
               v-model="newTagText"
               @keydown.delete.stop = "removeTag('last')"
               @keydown.enter.stop = "addTag"
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
                default: 'name'
            },
            /*是否限制重复value*/
            limitSameValue: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                newTagText: ''
            }
        },
        methods: {
            addTag(){
                if (this.limitSameValue && this.isSameValue(this.newTagText)) return;
                const newObj = {};
                newObj[this.tagKey] = this.newTagText;

                this.tags.push(newObj)
                this.newTagText = '';
            },
            removeTag(index){
                if (typeof index  === 'number'){
                    this.tags.splice(index,1);
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
                const  newObj = this.tags[index];
                newObj[this.tagKey] = newTagText;
                this.tags.splice(index, 1, newObj)
            },
            isSameValue(value){
                for (let i = 0 ,max = this.tags.length; i < max; i++){
                    if (this.tags[i][this.tagKey] === value){
                        return true
                    }
                }
                return false
            },
            focusInput(e){
                this.$refs.tagInput.focus();
                e.preventDefault();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "reset.css";
    @import "ele-theme.css";

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