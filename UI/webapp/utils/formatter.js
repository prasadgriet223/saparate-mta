sap.ui.define([], function () {
	"use strict";
	return {
		projectbuild: function (odate, number) {
			var d = new Date(0);
			d.setUTCSeconds(odate);
			return "Build " + number;
		},
		minutes: function (duration) {
			return (duration / 60000).toFixed(2) + "min";
		},
		buildStatus: function (status) {
			var result = "";
			if (status === 'FAILURE')
				result = "Error";
			else if (status === 'SUCCESS')
				result = "Success";
			else
				result = "Warning";
console.log(result);
			return result;
		},
		buildStagesStatus: function (status) {
			var result = "";
			if (status === 'FAILED')
				result = "Error";
			if (status === 'SUCCESS')
				result = "Success";
			return result;
		},
		addBuild: function (build) {
			return "Build #" + build;
		},
		addSec: function (sec) {
			return sec + "-Secs";
		},
		formatDate: function (date) {
			return date.substring(0, 19);
		}
	};
});