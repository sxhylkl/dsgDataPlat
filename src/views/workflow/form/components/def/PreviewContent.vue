<template>
    <div>
        <div v-html="html"></div>
    </div>
</template>

<script>
    export default {
        name: 'PreviewContent',
        props: ['html']
    }
</script>

