<template>
    <div class="app" :class="openSidebar ? 'app_264' : 'app_mini'">
        <nav class="app_nav">
            <basic-sidebar></basic-sidebar>
        </nav>
        <main class="app_main">
            <header :class="openSidebar ? 'app_header2' : 'app_header'">
                <basic-header></basic-header>
            </header>
            <div class="app_content">
                <!-- <slot name="content"/> -->
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import BasicSidebar from "./sidebar";
    import BasicHeader from "./header";
    import BasicFooter from "./footer";

    export default {
        components: {
            BasicSidebar,
            BasicHeader,
            BasicFooter
        },
        computed: {
            ...mapState({
                openSidebar: state => state.global.openSidebar,
            }),
        },
    };
</script>

<style lang="scss" scoped>
    .app {
        --spacing: 1rem;
        display: grid;
        height: 100vh;
        grid-template-rows: 0px 1fr 0px;
        grid-template-columns: 160px 1fr;
        grid-template-areas: "header header" "nav main" "footer footer";
    }

    .app_264 {
        grid-template-columns: 160px 1fr;
    }

    .app_mini {
        grid-template-columns: 64px 1fr;
    }

    .app_main {
        min-width: 950px;
        box-sizing: border-box;
        grid-area: main;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        background: rgba(15, 36, 67, 0.03);
    }

    .app_header {
        grid-area: header;
        height: 64px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
        width: calc(100% - 64px);
        position: fixed;
        top: 0;
        z-index: 1000;

    }

    .app_header2 {
        grid-area: header;
        height: 64px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
        width: calc(100% - 160px);
        position: fixed;
        top: 0;
        z-index: 1000;
    }

    .app_content {
        padding-top: 64px;
    }

    .app_nav {
        grid-area: nav;
        background: rgba(15, 36, 67, 1);
    }
</style>
