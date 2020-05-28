<template>
  <div class="table">
    <v-data-table
      v-model="selected"
      sort-by="id"
      class="elevation-4"
      :headers="headers"
      :items="filteredData"
      :loading="loading"
      :search="search"
      show-select
    >
      <template v-slot:top>
        <v-toolbar extended flat>
          <v-toolbar-title class="headline">{{ tr[table] }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="update()" icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn @click="addItem()" icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-badge
                :content="filtersCount"
                :value="filtersCount"
                color="info"
                overlap
                bordered
              >
                <v-btn v-on="on" icon>
                  <v-icon>mdi-filter-variant</v-icon>
                </v-btn>
              </v-badge>
            </template>
            <v-card>
              <v-card-title>Фильтры</v-card-title>
              <v-card-text>
                <v-form>
                  <v-select
                    v-for="({ text, value }, index) in headers.filter(
                      (item, i) => i !== headers.length - 1
                    )"
                    @change="filterData(index, value)"
                    v-model="filters[index].selected"
                    :key="index"
                    :label="text"
                    :items="
                      (formattedData.length ? formattedData : data).map(
                        (item) => item[value]
                      )
                    "
                    clearable
                  >
                  </v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="clearAllFilters()" color="error"
                  >Сбросить все</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-badge
                :content="selectedCount"
                :value="selectedCount"
                color="error"
                overlap
                bordered
              >
                <v-btn v-on="on" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-badge>
            </template>
            <v-list>
              <v-list-item @click="exportCsv()">
                <v-list-item-title>
                  Экспортировать
                  {{ selectedCount ? "выбранные" : "" }}
                  (.csv)
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteSelected()" :disabled="!selectedCount">
                Удалить выбранные
              </v-list-item>
            </v-list>
          </v-menu>
          <template v-slot:extension>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Поиск"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </template>
        </v-toolbar>
      </template>
      <template v-if="table === 'mark'" v-slot:item.mark="{ item }">
        <v-chip :color="getColor(item.mark)">
          {{ item.mark }}
        </v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog.visible" max-width="500px" scrollable persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialog.title }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-form v-model="formValid">
              <v-text-field
                v-for="{ name, notnull, type, pk } in inputFields"
                v-model="editForm[name]"
                :type="type === 'INTEGER' ? 'number' : 'text'"
                :label="tr[name]"
                :key="name"
                :disabled="pk === 1"
                :rules="[
                  (v) =>
                    notnull === 0 || !!v || 'Это поле не может быть пустым',
                  (v) =>
                    !data
                      .filter((item) => item.id !== editForm.id)
                      .some(
                        (item) => uniques.includes(name) && item[name] === v
                      ) || 'Это поле должно быть уникальным',
                  (v) =>
                    name !== 'mark' ||
                    [2, 3, 4, 5].includes(Number(v)) ||
                    'Оценка может быть только от 2 до 5',
                  (v) =>
                    name !== 'roomPhone' ||
                    (v.toString().startsWith('380') && v.length === 12) ||
                    'Номер телефона должен иметь формат: 380#########',
                ]"
              ></v-text-field>
              <v-select
                v-for="{ name, items } in foreignKeySelects"
                v-model="editForm[name]"
                :key="name"
                :items="items"
                :label="tr[name]"
                :rules="[(v) => !!v || 'Необходимо выбрать значение']"
              ></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog()">
            Закрыть
          </v-btn>
          <v-btn
            @click="save()"
            :disabled="!formValid"
            color="blue darken-1"
            text
          >
            {{ dialog.mode === "add" ? "Добавить" : "Сохранить" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { TableInfo } from "@/@types/TableInfo";
import { ForeignKey } from "@/@types/ForeignKey";

import translation from "@/constants/translation";

type TableItem = {
  id: string;
  name: string;
  [key: string]: string;
};

type EditForm = {
  [key: string]: string;
};

type ForeignKeySelectItem = {
  text: string;
  value: string;
};

type ForeignKeySelect = {
  name: string;
  items: ForeignKeySelectItem[];
};

type ForeignKeyData = {
  [key: string]: TableItem[];
};

type TableHeader = {
  text: string;
  value: string;
  sortable?: boolean;
};

type FilterItem = {
  selected: undefined | string;
};

export default Vue.extend({
  name: "Table",
  data() {
    return {
      table: "",
      headers: [] as TableHeader[],
      data: [] as TableItem[],
      selected: [] as TableItem[],
      formattedData: [] as TableItem[],
      filteredData: [] as TableItem[],
      info: [] as TableInfo[],
      uniques: [] as string[],
      editForm: {} as EditForm,
      formValid: true,
      loading: false,
      foreignKeys: [] as ForeignKey[],
      foreignKeysData: {} as ForeignKeyData,
      foreignKeySelects: [] as ForeignKeySelect[],
      filters: [] as FilterItem[],
      dialog: {
        visible: false,
        mode: "edit",
        title: "Редактирование",
      },
      tr: {},
      search: "",
    };
  },
  computed: {
    inputFields(): TableInfo[] {
      return this.info.filter(
        (info) => !this.foreignKeys.find((key) => key.from === info.name)
      );
    },
    selectedCount(): number {
      return this.selected.length;
    },
    filtersCount(): number {
      return this.filters.filter((item) => item.selected).length;
    },
  },
  watch: {
    async $route(/* to, from */) {
      await this.update();
    },
  },
  async created() {
    await this.update();
  },
  methods: {
    async formatSelectText(
      table: string,
      item: TableItem
    ): Promise<string | null> {
      if (item) {
        let text = `${item.id} - `;
        switch (table) {
          case "faculty": {
            text += item.name;
            break;
          }
          case "teacher": {
            text += `${item.surname} ${item.name} ${item.patronymic}`;
            break;
          }
          case "group": {
            text += `${item.branch}-${item.number}`;
            break;
          }
          case "subject": {
            text += item.name;
            break;
          }
          case "load": {
            const subjectReq = await axios(
              `/api/get/subject?id=${item.subjectId}`
            );
            const teacherReq = await axios(
              `/api/get/teacher?id=${item.teacherId}`
            );
            if (subjectReq?.status === 200) {
              text += subjectReq.data.name;
            }
            text += `, ${item.year} - `;
            if (teacherReq?.status === 200) {
              const {
                data: {
                  name: [name],
                  surname,
                  patronymic: [patronymic],
                },
              } = teacherReq;
              text += `${surname} ${name}. ${patronymic}.`;
            }
            break;
          }
          case "student": {
            text += `${item.surname} ${item.name}`;
            break;
          }
          case "certification": {
            const loadRes = await axios.get(`/api/get/load?id=${item.loadId}`);
            if (loadRes?.status === 200) {
              const subjectRes = await axios.get(
                `/api/get/subject?id=${loadRes.data.id}`
              );
              if (subjectRes?.status === 200) {
                text += `${subjectRes.data.name} (`;
              }
            }
            text += `${item.date})`;
            break;
          }
        }
        return text;
      }
      return null;
    },
    async getForeignKeySelects() {
      const res: ForeignKeySelect[] = [];
      for (const fk of this.foreignKeys) {
        const items: ForeignKeySelectItem[] = [];
        const keyData = this.foreignKeysData[fk.from];
        if (keyData) {
          try {
            for (const item of keyData) {
              const formatRes = await this.formatSelectText(fk.table, item);
              if (formatRes) {
                items.push({
                  text: formatRes,
                  value: item.id,
                });
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
        res.push({ name: fk.from, items });
      }
      this.foreignKeySelects = res;
    },
    setData() {
      this.filteredData = this.formattedData.length
        ? this.formattedData
        : this.data;
    },
    async update() {
      try {
        this.loading = true;
        this.data = [];
        this.formattedData = [];
        this.info = [];
        this.uniques = [];
        this.headers = [];
        this.foreignKeys = [];
        this.foreignKeysData = {};
        this.foreignKeySelects = [];
        this.filters = [];
        this.table = this.$route.params.table;
        this.tr =
          translation.table[this.table as keyof typeof translation.table];
        const res = await axios.get(`/api/get/${this.table}`);
        if (res?.status === 200) {
          const { data } = res;
          if (data?.length) {
            for (const key in data[0]) {
              this.headers.push({
                text: this.tr[key as keyof {}],
                value: key,
              });
              this.filters.push({ selected: undefined });
            }
            this.headers.push({
              text: "",
              value: "action",
              sortable: false,
            });
            this.data = data;
          }
        }
        this.editForm = {};
        const infoRes = await axios.get(`/api/info/${this.table}`);
        if (infoRes?.status === 200) {
          const { data: info } = infoRes;
          if (info?.length) {
            this.info = infoRes.data;
            for (const { name } of this.info) {
              this.editForm[name as keyof {}] = "";
            }
          }
        }
        const foreignKeysRes = await axios.get(
          `/api/foreignKeys/${this.table}`
        );
        if (foreignKeysRes?.status === 200) {
          const { data: fks } = foreignKeysRes;
          if (fks?.length) {
            this.foreignKeys = fks;
            for (const { table, from } of this.foreignKeys) {
              const foreignKeyDataRes = await axios(`/api/get/${table}`);
              if (foreignKeyDataRes?.status === 200) {
                const foreignKeyData: TableItem[] = foreignKeyDataRes.data;
                if (foreignKeyData?.length) {
                  this.foreignKeysData[from] = foreignKeyData;
                }
              }
            }
            this.getForeignKeySelects();
            if (this.$store.state.settings.formatData) {
              this.formattedData = JSON.parse(JSON.stringify(this.data));
              for (let i = 0; i < this.formattedData.length; i += 1) {
                for (const { from, table, to } of this.foreignKeys) {
                  try {
                    const formatRes = await this.formatSelectText(
                      table,
                      this.foreignKeysData[from].find(
                        (item) => item[to] === this.formattedData[i][from]
                      ) as TableItem
                    );
                    if (formatRes) {
                      this.formattedData[i][from] = formatRes;
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }
              }
            }
          }
        }
        const uniquesRes = await axios.get(`/api/getUniques/${this.table}`);
        if (uniquesRes?.status === 200) {
          ({ data: this.uniques } = uniquesRes);
        }
        this.setData();
        this.loading = false;
      } catch (err) {
        console.error(err);
        this.loading = false;
      }
      this.loading = false;
    },
    async addItem() {
      this.dialog.mode = "add";
      this.dialog.title = "Добавление";
      try {
        const nextIdRes = await axios.get(`/api/nextId/${this.table}`);
        if (nextIdRes.status === 200) {
          for (const key of Object.keys(this.editForm)) {
            this.editForm[key] = "";
          }
          this.editForm.id = nextIdRes.data.id;
          this.dialog.visible = true;
        } else {
          window.alert(nextIdRes.status);
        }
      } catch (err) {
        window.alert(err);
      }
    },
    editItem(item: TableItem) {
      this.dialog.mode = "edit";
      this.dialog.title = "Редактирование";
      const actualItem = this.data.find((x) => x.id === item.id);
      if (actualItem) {
        for (const key of Object.keys(actualItem)) {
          this.editForm[key] = actualItem[key as keyof TableItem];
        }
        this.dialog.visible = true;
      } else {
        console.log("An error occured");
      }
    },
    async save() {
      try {
        if (this.dialog.mode === "edit") {
          const updateReq = await axios.post(
            `/api/update/${this.table}/${this.editForm.id}?${Object.keys(
              this.editForm
            )
              .map((k) => `${k}=${this.editForm[k]}`)
              .join("&")}`
          );
          if (updateReq.status === 200) {
            this.dialog.visible = false;
            await this.update();
          }
        } else {
          const saveReq = await axios.post(
            `/api/add/${this.table}?${Object.keys(this.editForm)
              .map((k) => `${k}=${this.editForm[k]}`)
              .join("&")}`
          );
          if (saveReq.status === 200) {
            this.dialog.visible = false;
            await this.update();
          }
        }
      } catch (err) {
        window.alert(err);
        console.error(err);
      }
    },
    async deleteItem({ id }: TableItem) {
      try {
        const delReq = await axios.delete(`/api/delete/${this.table}/${id}`);
        if (delReq.status === 200) {
          this.update();
          window.alert("Element deleted successfully");
        }
      } catch (err) {
        window.alert("An error occurred");
      }
    },
    async deleteSelected() {
      const res = await axios.delete(
        `/api/delete/${this.table}/${this.selected.map((item) => item.id)}`
      );
      if (res.status === 200) {
        window.alert("Sucessfully deleted");
        this.selected = [];
        this.update();
      }
    },
    closeDialog() {
      this.dialog.visible = false;
    },
    exportCsv() {
      const SEP = ";";
      let csvContent = `data:text/csv;charset=utf-8,${this.headers
        .map((header) => {
          if (header.text) {
            return header.text;
          }
        })
        .join(SEP)}\n`;
      const selected = this.selected;
      const data = selected.length ? selected : this.data;
      for (const item of data) {
        csvContent += `${Object.keys(item)
          .map((key) => item[key])
          .join(SEP)}\n`;
      }
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      const now = new Date();
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `${this.table}${
          selected.length ? ` (${selected.length})` : ""
        }_${now.getDay()}.${now.getMonth()}.${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.csv`
      );
      document.body.appendChild(link);
      link.click();
    },
    getColor(mark: string) {
      const num = Number(mark);
      if (num === 2) {
        return "red";
      } else if (num === 3) {
        return "orange";
      } else {
        return "green";
      }
    },
    filterData() {
      this.setData();
      if (this.filters.some((filter) => !!filter.selected)) {
        this.filters.forEach((filter, index) => {
          if (filter.selected) {
            this.filteredData = this.filteredData.filter(
              (item) => item[this.headers[index].value] === filter.selected
            );
          }
        });
      }
    },
    clearAllFilters() {
      for (const filter of this.filters) {
        filter.selected = undefined;
      }
      this.setData();
    },
  },
});
</script>
