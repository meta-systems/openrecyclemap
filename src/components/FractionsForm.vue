<template>
    <div class="tags_window">
        <div class="node_type">
            <div class="box_title">Укажите тип контейнера</div>
            <div class="node_type_choice">
                <v-btn @click="waste_disposal = false" color="primary"><v-icon v-if="!waste_disposal">check</v-icon> Переработка</v-btn>
                <v-btn @click="waste_disposal = true" color="#8D6E63" dark><v-icon v-if="waste_disposal">check</v-icon> Обычная мусорка</v-btn>
            </div>
        </div>
        <div class="tags_box" v-if="!waste_disposal">
            <div class="node_tags">
                <div class="box_title">Фракции выбранной точки</div>
                <span v-for="(value, key) in recycling" v-if="value"
                      :class="['p_fraction', 'ico_'+key]" @click="recycling[key] = !recycling[key]">{{ labels[key] }}</span>
            </div>
            <div class="f_list f_list_add">
                <div class="box_title">Доступные фракции</div>
                <span v-for="(value, key) in recycling" v-if="!value"
                      :class="['p_fraction', 'ico_'+key]" @click="recycling[key] = !recycling[key]">{{ labels[key] }}</span>
            </div>
        </div>
        <div class="description_box">
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
        props: ['labels'],
        data: function () {
            return {
                description: '',
                waste_disposal: true,
                recycling: {
                    plastic: false,
                    paper: false,
                    cans: false,
                    glass_bottles: false,
                    batteries: false,
                    low_energy_bulbs: false,
                    plastic_bags: false,
                    //plastic_bottles: false
                }
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
                for (let key in this.recycling) {
                    if(this.recycling.hasOwnProperty(key) && this.recycling[key]) {
                        return true;
                    }
                }
                return this.waste_disposal;
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
                }
                return tags;
            },
            saveData: function () {
                if(!this.hasData()) {
                    return;
                }
                let tags = this.buildTags();
                this.$emit('form-save', {
                    tags: tags,
                    amenity: tags.amenity
                });
            },
            cancelAddMode: function () {
                this.$emit('form-cancel');
            }
        }
    }
</script>

<style>
    .tags_window {
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:white;
        z-index: 1;
        display:flex;
        padding:20px;
        flex-direction: column;
    }
    .tags_window .p_fraction:hover {
        background-color:#eee;
        cursor:pointer;
    }
    .node_tags {
        width:45%;
    }
    .box_title {
        margin-bottom:15px;
        margin-top:25px;
        line-height:1.2em;
        display:inline-block;
        border-bottom:4px solid #ECB5FF;
    }
    .f_list_add {
        width:45%;
        margin-left:auto;
    }
    .tags_box {
        display:flex;
    }
    .node_type_choice {
        display:flex;
    }
</style>