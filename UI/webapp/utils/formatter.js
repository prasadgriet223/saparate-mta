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
			return result;
		},
		CycleStatus: function (status) {
			var result = "";
			if (status === 'FAILED')
				result = "Error";
			else if (status === 'COMPLETED')
				result = "Success";
			else
				result = "Warning";
			return result;
		},
		buildStagesStatus: function (status) {
			var result = "";
			if (status === 'FAILED')
				result = "Error";
			else if (status === 'SUCCESS')
				result = "Success";
			else
				result = "Warning";
			return result;
		},
		addBuild: function (build) {
			return "Build #" + build;
		},
		addSec: function (sec) {
			return sec + "-Secs";
		},
		getDate: function (date) {
			var d = new Date(date);
			return (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
		},
		CyclestageStatus: function (status) {
			var result = "";
			if (status === 'FAILED')
				result = "Error";
			else if (status === 'COMPLETED')
				result = "Success";
			else
				result = "Warning";
			return result;
		},
		deployTaskLabel: function (stageName, type) {
			return stageName + " " + type;
		},
		Cyclestagetime: function (time) {
			return time.replace("+0000", "").replace("T", " ");
		},
		getRepoName: function (url) {
			return url.substring(url.lastIndexOf("/")+1,url.length).split(".")[0];
		},
		getBranchName: function (branch) {
			return branch.split("/")[1];
			
		}
	};
});