<template>
    <div class="tags_window">
        <div class="node_type">
            <div class="box_title">Укажите тип</div>
            <div class="node_type_choice">
                <div @click="waste_disposal = true;type_btn = 'waste'" :class="['type_btn type_waste', { type_active: type_btn === 'waste' }]" >Несортированный мусор</div>
                <div @click="waste_disposal = false;type_btn = 'recycle'" :class="['type_btn type_recycle', {type_active: type_btn === 'recycle'}]" >Раздельный сбор</div>
                <div @click="waste_disposal = false;type_btn = 'org'" :class="['type_btn type_org', {type_active: type_btn === 'org'}]" >Организация</div>
            </div>
        </div>

        <!--
        <div class="org_type_box" v-if="type_btn === 'org'">
            <div class="box_title">Тип организации</div>
            <div class="node_type_choice">
                <div @click="org_type = 'uk'" :class="['type_btn type_org org_uk', { type_active: org_type === 'uk' }]" >Управляющая компания</div>
                <div @click="org_type = 'eco'" :class="['type_btn type_org org_eco', {type_active: org_type === 'eco'}]" >Экологическая организация</div>
            </div>
        </div>
        -->
        <div class="name_box" v-if="type_btn === 'org'">
            <div class="box_title">Название организации</div>
            <v-text-field label="Название" solo v-model="name"></v-text-field>
        </div>
        <div class="tags_box" v-if="!waste_disposal">
            <div class="node_tags">
                <div class="box_title">Выбрано</div>
                <span
                    v-for="(value, key) in recycling"
                    v-if="value"
                    :class="['p_fraction', 'ico_'+key]"
                    @click="recycling[key] = !recycling[key]"
                >{{ labels[key] }}</span>

                <div v-if="!isRecycling" class="tags_not_selected">Выберите типы принимаемых отходов</div>
            </div>
            <div class="f_list f_list_add">
                <div class="box_title">Доступно</div>
                <span v-for="(value, key) in recycling" v-if="!value"
                      :class="['p_fraction', 'ico_'+key]" @click="recycling[key] = !recycling[key]">{{ labels[key] }}</span>
            </div>
        </div>
        <div v-if="!waste_disposal" class="description_box">
            <div class="box_title">Описание</div>
            <v-textarea label="Описание" rows="2" solo v-model="description"></v-textarea>
        </div>
        <div class="add_mode_steps">
            <div class="btn btn_gray" @click="cancelAddMode">Отмена</div>
            <div class="btn btn_green btn_add_next" @click="saveData">Сохранить</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "fractions-form",
        props: ['labels', 'selected'],
        data: function () {
            return {
                node_type: 'node',
                node_id: null,
                name: '',
                type_btn: 'waste',
                description: '',
                waste_disposal: true,
                recycling: {
                    plastic: false,
                    paper: false,
                    cans: false,
                    glass: false,
                    glass_bottles: false,
                    plastic_bags: false,
                    clothes: false,
                    batteries: false,
                    low_energy_bulbs: false,
                    plastic_bottles: false,
                    hazardous_waste: false,
                    scrap_metal: false,
                    engine_oil: false
                }
            }
        },
        computed: {
            isRecycling: function () {
                for (let key in this.recycling) {
                    if(this.recycling.hasOwnProperty(key) && this.recycling[key]) {
                        return true;
                    }
                }
                return false;
            }
        },
        methods: {
            clearRecycling: function () {
                for (let key in this.recycling) {
                    this.recycling[key] = false;
                }
            },
            initData: function () {
                this.description = null;
                this.waste_disposal = false;
                this.clearRecycling();
            },
            hasData: function () {
                return this.isRecycling || this.waste_disposal;
            },
            buildTags: function () {
                let tags = {
                    amenity: this.waste_disposal ? 'waste_disposal' : 'recycling'
                };
                if (this.description) {
                    tags.description = this.description;
                }
                if (!this.waste_disposal) {
                    for (let key in this.recycling) {
                        if(this.recycling.hasOwnProperty(key) && this.recycling[key]) {
                            tags['recycling:'+key] = 'yes';
                        }
                    }
                    if (this.type_btn === 'org') {
                        tags['recycling_type'] = 'centre';
                        if (this.name) {
                            tags['name'] = this.name;
                        }
                    }
                    else {
                        tags['recycling_type'] = 'container';
                    }
                }
                return tags;
            },
            saveData: function () {
                if(!this.hasData()) {
                    return;
                }
                let tags = this.buildTags();
                this.$emit('form-save', {
                    id: this.node_id,
                    type: this.node_type,
                    tags: tags,
                    amenity: tags.amenity
                });
            },
            cancelAddMode: function () {
                this.$emit('form-cancel');
            }
        },
        created() {
            if(this.selected) {
                let geoJsonProps = this.selected.props;
                let centre = geoJsonProps.hasOwnProperty('recycling_type') && geoJsonProps.recycling_type === 'centre';
                this.description = geoJsonProps.description;
                this.name = geoJsonProps.name;
                this.waste_disposal = geoJsonProps.amenity === 'waste_disposal';
                this.type_btn = this.waste_disposal
                    ? 'waste'
                    : (centre ? 'org' : 'recycle');
                if(!this.waste_disposal) {
                    this.selected.fractions.forEach((item) => this.recycling[item] = true);
                }
                this.node_type = this.selected.node_type;
                this.node_id = this.selected.node_id;
            }
        }
    }
</script>

<style>
    .tags_not_selected {
        color:#777;
        font-style: italic;
        padding-right:20px;
        line-height: 1.2em;
        padding-top:10px;
    }
    .tags_window {
        right:auto;
        width:400px;
        position:absolute;
        top:0;
        left:0;
        bottom:50px;
        background:white;
        z-index: 1;
        display:flex;
        padding:0 3%;
        flex-direction: column;
        overflow:auto;
        padding-bottom:10px;
        z-index: 10;

    }


    @media screen and (max-width: 500px) {

        .tags_window {
            width:auto;
            right:0;
        }
    }
    .node_tags .p_fraction:hover {
        background:#ffc0cb63 !important;
    }

    @media screen and (max-width: 500px) {
        .node_tags .p_fraction:hover:after {
            display:none;
        }
    }
    .node_tags .p_fraction:hover:after {
        width:30px;
        height:30px;
        content:'×';
        margin-left:auto;
        text-align:center;
        font-size:30px;
        line-height:30px;
        line-height:30px;
        color:#ee8a8a;
    }
    .f_list_add .p_fraction:hover {
        background-color:#eee !important;
    }
    .p_fraction:before {
        content:'';
        width:35px;
        height:35px;
        min-width:35px;
        background-size:contain;
        margin-right:5px;
    }
    .p_fraction {
        position:relative;
        display:block;
        background-size:contain;
        margin-bottom:5px;
        padding:5px;
        font-size:16px;
        line-height: 1em;
        min-height:33px;
        display:flex;
        align-items: center;
        border-radius:4px;
        cursor:pointer;
        background:none !important;
        user-select: none;
    }
    .node_tags .p_fraction {
        background:rgba(46, 125, 50, 0.1) !important;
    }
    .box_title {
        margin-bottom:15px;
        margin-top:25px;
        line-height:1.2em;
        display:inline-block;
        font-weight:bold;
        font-size:18px;
        /*border-bottom:4px solid #ECB5FF;*/
    }
    .node_tags,
    .f_list_add {
        width:47%;
    }
    .f_list_add {
        /*margin-left:auto;*/
    }
    .tags_box {
        display:flex;
        justify-content: space-around;
    }
    .node_type {
        margin-bottom:15px;
    }
    .node_type_choice {
        display:flex;
    }
    .type_btn.type_active,
    .type_btn:hover {
        background-color: rgba(46, 125, 50, 0.1);
    }
    .type_btn {
        border-radius:8px;
        padding:2%;
        padding-top:70px;
        line-height: 1em;
        background-position: top center;
        text-align:center;
        cursor: pointer;
        max-width: 35%;
        overflow-wrap: break-word;
        user-select: none;
        width:120px;
    }
    .type_waste.type_active,
    .type_waste:hover {
        background-color: rgba(141, 110, 99, 0.17);
    }
    .type_waste {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='63' height='63' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M39.282 44.714a5.295 5.295 0 0 0-5.288 5.288 5.294 5.294 0 0 0 5.288 5.289 5.294 5.294 0 0 0 5.289-5.289 5.295 5.295 0 0 0-5.289-5.288zm0 9.278c-2.2 0-3.99-1.79-3.99-3.99s1.79-3.989 3.99-3.989 3.99 1.79 3.99 3.99-1.79 3.989-3.99 3.989zM46.9 12.142l-2.397 4.026h-.895v-.647h-1.733v-2.213L38.758 11H18.85l-3.119 2.308v2.213H14V21h1.885v2.885h1.3v-2.87h23.22v11.594l-1.05 10.126 1.292.134 1.054-10.16.003-11.71h1.904v-.673h3.251l2.413-4.026h2.945v-4.157H46.9zM42.31 19.7h-27.01v-2.88h18.88v-1.299H17.031v-1.559L19.28 12.3h19.05l2.248 1.664v1.558H35.94v1.3h6.369V19.7zm8.608-4.7h-2.381l-2.413 4.026h-2.515v-1.558h1.633l2.398-4.027h3.278v1.558z' fill='%23000'/%3E%3Cpath d='M24.498 33.063l-.45-1.265-1.223.436 1.16 3.26 3.259-1.161-.436-1.224-1.064.379 3.2-5.987 1.97 3.65 1.143-.617-3.118-5.778-4.44 8.306zM28.499 40.486l-.878.878.919.919 2.446-2.446-2.447-2.447-.918.919.878.878h-5.865l1.479-2.742-1.143-.617-2.514 4.658H28.5zM35.162 32.264l-3.373-.767-.767 3.373 1.267.288.238-1.047 2.726 5.076h-3.677v1.3h5.849l-3.9-7.263 1.35.306.287-1.267z' fill='%23000'/%3E%3Cpath d='M17.184 32.608v-8.856h-1.299v8.89l2.25 21.736h14.946V53.08H19.307l-2.123-20.472z' fill='%23000'/%3E%3C/svg%3E");
    }
    .type_recycle {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='63' height='63' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 55V13h29v42H17z' stroke='%23000' stroke-width='1.5'/%3E%3Ccircle cx='31.5' cy='21' r='3.3' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E");
    }
    .type_org {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='63' height='63' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M52.3 50.8h-2.1V13.7c0-.42-.28-.7-.7-.7h-35c-.42 0-.7.28-.7.7v37.1h-2.1c-.42 0-.7.28-.7.7v2.8c0 .42.28.7.7.7h40.6c.42 0 .7-.28.7-.7v-2.8c0-.42-.28-.7-.7-.7zM15.2 14.4h33.6v36.4H38.3v-7.7c0-.42-.28-.7-.7-.7H26.4c-.42 0-.7.28-.7.7v7.7H15.2V14.4zm11.9 36.4v-7h4.2v7h-4.2zm5.6-7h4.2v7h-4.2v-7zm18.9 9.8H12.4v-1.4h39.2v1.4z' fill='%23000'/%3E%3Cpath d='M24.3 18.5h-5.6c-.42 0-.7.28-.7.7v5.2c0 .42.28.7.7.7h5.6c.42 0 .7-.28.7-.7v-5.2c0-.42-.28-.7-.7-.7zm-.7 5.2h-4.2v-3.8h4.2v3.8zM24.3 31.2h-5.6c-.42 0-.7.28-.7.7v5.2c0 .42.28.7.7.7h5.6c.42 0 .7-.28.7-.7v-5.2c0-.42-.28-.7-.7-.7zm-.7 5.2h-4.2v-3.8h4.2v3.8zM29.2 37.8h5.6c.42 0 .7-.28.7-.7v-5.2c0-.42-.28-.7-.7-.7h-5.6c-.42 0-.7.28-.7.7v5.2c0 .42.28.7.7.7zm.7-5.2h4.2v3.8h-4.2v-3.8zM39.7 37.8h5.6c.42 0 .7-.28.7-.7v-5.2c0-.42-.28-.7-.7-.7h-5.6c-.42 0-.7.28-.7.7v5.2c0 .42.28.7.7.7zm.7-5.2h4.2v3.8h-4.2v-3.8zM29.2 25.1h5.6c.42 0 .7-.28.7-.7v-5.2c0-.42-.28-.7-.7-.7h-5.6c-.42 0-.7.28-.7.7v5.2c0 .42.28.7.7.7zm.7-5.2h4.2v3.8h-4.2v-3.8zM39.7 25.1h5.6c.42 0 .7-.28.7-.7v-5.2c0-.42-.28-.7-.7-.7h-5.6c-.42 0-.7.28-.7.7v5.2c0 .42.28.7.7.7zm.7-5.2h4.2v3.8h-4.2v-3.8z' fill='%23000'/%3E%3C/svg%3E");
    }
</style>
