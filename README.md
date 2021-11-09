修复下拉选择框报错问题:

    1、查看本地 node_modules\vue-material\dist\vue-material.js
    2、搜索 isInvalidValue
    3、修改一下代码:
        old：
            return this.$el.validity.badInput;
        new
            return this.$el.validity ? this.$el.validity.badInput : false;

