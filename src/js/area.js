

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
        axios.jsonp(apiDomain + serachFieldUrl).then(function (response) {
            var data = JSON.parse(response);
            console.log(data);
            // if (data.code >= 0) {
            //     searchField.data = data.data;
            //     _this.areas = data.data.city;
            // }
            mArea.areas = [123, 123, 123, 123];
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