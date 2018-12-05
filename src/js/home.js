

var mArea = new Vue({
    el: "#page-area",
    data: {
        isShow: 1,
        currentArea: "徐州",
        areas: [""],
        citys: [""]
    },

    created: function () {
        var _this = this;
        axios.jsonp("http://juhe.api.321184.com/zbnew/search/get_all_city_jsonp").then(function (response) {
            var data = JSON.parse(response);
            console.log(data);
            if (data.code >= 0) {
                _this.areas = data.data.city;
            }

        }).catch(function (error) {
            console.log(error);
        });


    },


    methods: {
        hidePage: function () {
            this.data.isShow = false;
            console.log(123);
        },
        showPage: function () {
            this.data.isShow = true;
        },
        cityChange: function (e) {
            console.log(e);
            app.searchParams.area.name = "123";
        }
    }
});