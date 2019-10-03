<template>
    <div class="node_info">
        <span class="p_close" @click="closePopup">×</span>

        <div class="f_list">
            <span v-for="item in fractions" :class="['p_fraction', 'ico_'+item]">{{ labels[item] }}</span>
        </div>
        <table>
            <tr v-for="(item, key, index) in all_tags" ><td>{{ key }}</td><td>{{ item }}</td></tr>
        </table>

        <div v-if="description" class="f_description">{{ description }}</div>

        <a target="_blank" class="p_link" :href="osmLink">Смотреть в OSM</a>
        <a target="_blank" class="p_link" :href="josmLink" title="Редактировать в JOSM">(J)</a>

        <div class="edit_box">
            <span @click="goEdit" class="btn btn_gray">Редактировать</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "node-info",
        props: ['labels', 'selected'],
        data: function () {
            return {
                all_tags: null,
                node_type: null,
                node_id: null,
                fractions: null,
                description: null,
                amenity: null,
                centre: null,
                name: null
            }
        },
        computed: {
            osmLink: function () {
                return 'https://openstreetmap.org/' + this.node_type + '/' + this.node_id;
            },
            josmLink: function () {
                return 'http://127.0.0.1:8111/load_object?objects=' + this.node_type.substring(0, 1) + this.node_id;
            },
        },
        methods: {
            closePopup: function () {
                this.$emit('close-info');
            },
            goEdit: function () {
                this.$emit('edit-click');
            }
        },
        created() {
            if (this.selected) {
                let geoJsonProps = this.selected.props;
                this.all_tags = geoJsonProps;
                delete this.all_tags.id;
                this.node_type = this.selected.node_type;
                this.node_id = this.selected.node_id;
                this.fractions = this.selected.fractions;
                this.description = geoJsonProps.description;
                this.amenity = geoJsonProps.amenity;
                this.centre = geoJsonProps.hasOwnProperty('recycling_type') && geoJsonProps.recycling_type === 'centre';
                this.name = geoJsonProps.name;
            }
        }
    }
</script>

<style>
    .node_info {
        background:white;
        border-radius:15px;
        padding:20px;
        position:absolute;
        top:10px;
        left:10px;
        padding-top:40px;
        z-index:1;
        max-width: 300px;
    }
    .edit_box {
        margin-top:15px;
    }
</style>