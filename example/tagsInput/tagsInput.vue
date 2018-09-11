<template>
    <div>
        <tagsInput
            :tags="tags"
        />
        {{tags}}
    </div>
</template>
<script>
    import tagsInput from '../../src/tagsInput.vue';
    export default{
        components:{
            tagsInput,
        },
        data(){
            return {
                tags: [{
                    name: 'test',
                    id: 123123
                },{
                    name: 'test1'
                }]
            }
        }
    }
</script>