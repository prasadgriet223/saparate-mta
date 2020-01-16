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
			var month = parseInt(d.getMonth()) + 1 <= 9 ? "0" + parseInt(d.getMonth()+1) : d.getMonth();
			var day = parseInt(d.getDate()) <= 9 ? "0" + d.getDate() : d.getDate();
			var hrs = parseInt(d.getHours()) <= 9 ? "0" + d.getHours() : d.getHours();
			var mins = parseInt(d.getMinutes()) <= 9 ? "0" + d.getMinutes() : d.getMinutes();
			return (day + "/" + month + "/" + d.getFullYear() + " " + hrs + ":" + mins);
		},
		getRecyclyeDate: function (time) {
			if (time !== null) {
				var parts = time.split("T");
				var date = parts[0];
				var timeM = parts[1];
				return date + " " + timeM.split(":")[0] + ":" + timeM.split(":")[1];
			}
			return "";
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
			if (time !== null) {
				var parts = time.split("T");
				var date = parts[0];
				var timeM = parts[1];
				return date + " " + timeM.split(":")[0] + ":" + timeM.split(":")[1];
			}
			return null;
		},
		getRepoName: function (url) {
			return url.substring(url.lastIndexOf("/") + 1, url.length).split(".")[0];
		},
		getBranchName: function (branch) {
			return branch.split("/")[1];

		},
		TaskNameFormatter: function (task) {
			if (task !== null) {
				if (task === "manualTask")
					task = "Manual task";
				else if (task === "approvalTask")
					task = "Approval task";
				else {
					task = "";
				}
				return task;
			}
		},
		deployTaskStatusFormatter: function (deploytaskStatus) {
			if (deploytaskStatus !== null) {
				if (deploytaskStatus === "WAITING") {
					deploytaskStatus = "IN PROGRESS";
				}
				return deploytaskStatus;
			}

		}
	};
});