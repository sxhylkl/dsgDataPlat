;
(function ($) {
    $.utils = (function () {
        var _getUrl = function (shortUrl, callback) {
            if (!shortUrl || shortUrl == "") {
                callback("");
                return;
            }
            $.ajax({
                url: DataOpen.apiHostName + '/dataopen/api/url/' + shortUrl,
                method: 'GET',
                dataType: 'jsonp'
            }).done(function(data, res, code) {
                if (data.code == "success") {
                    callback(data.data);
                } else {
                    callback(data.error);
                }
            });
        };

        var _getFrequency = function (frequency) {
            if (frequency == 0) {
                return "年";
            }
            if (frequency == 1) {
                return "月";
            }
            if (frequency == 2) {
                return "天";
            }
            if (frequency == 3) {
                return "实时";
            }
            return frequency;
        };

        var _getOrganization = function (orgId, callback) {
            if (!orgId || orgId == "") {
                callback(undefined);
                return;
            }
            $.ajax({
                url: DataOpen.apiHostName + '/dataopen/api/organization/' + orgId,
                method: 'GET',
                dataType: 'jsonp'
            }).done(function(data, res, code) {
                if (data.code == "success") {
                    callback(data.data);
                } else {
                    callback(undefined);
                }
            });
        };

        var _getOrganizationName = function (orgId, callback) {
            _getOrganization(orgId, function (org) {
                if(org){
                    callback(org.name);
                }else {
                    callback("");
                }
            });
        };

        var _getTopic = function () {

        };

        return {
            getUrl: _getUrl,
            getFrequency: _getFrequency,
            getOrganization: _getOrganization,
            getOrganizationName :_getOrganizationName,
            getTopic:_getTopic
        }
    })();
})(jQuery);