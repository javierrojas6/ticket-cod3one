import React from 'react';
import API from 'lib-app/api-call';
import date from 'lib-app/date';

export default {
    getInitialDateRange() {
        let firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0);
        firstDayOfMonth.setMinutes(0);
        let todayAtNight = new Date();
        todayAtNight.setHours(23);
        todayAtNight.setMinutes(59);

        return {
            startDate: date.getFullDate(firstDayOfMonth),
            endDate: date.getFullDate(todayAtNight)
        };
    },

    getSelectedTagIds(rawForm, tags) {
        return tags.filter(tag => _.includes(rawForm.tags, tag.name)).map(tag => tag.id);
    },

    getDateRangeFromPeriod(periodIndex) {
        let daysInPeriod = 0;
        switch (periodIndex) {
            case 0:
                daysInPeriod = 7;
                break;
            case 1:
                daysInPeriod = 30;
                break;
            case 2:
                daysInPeriod = 90;
                break;
            case 3:
                daysInPeriod = 365;
                break;
        }
        const d = new Date();
        d.setDate(d.getDate() - daysInPeriod);

        const startDate = date.getFullDate(d);
        const endDate = date.getCurrentFullDate();
        return {
            startDate,
            endDate
        };
    },

    retrieveStats({ rawForm, tags, departments}) {
        const { dateRange } = rawForm;
        const dateRangeProp = dateRange && {dateRange: "[" + dateRange.startDate.toString() + "," + dateRange.endDate.toString() + "]"};
        
        return API.call({
            path: '/system/get-stats',
            data: {
                ...dateRangeProp,
                departments: departments ? JSON.stringify(departments) : "[" + rawForm.departments.map(department => department.id) + "]",
                owners: "[" + rawForm.owners.map(owner => owner.id) + "]",
                tags: tags ? "[" + this.getSelectedTagIds(rawForm, tags) + "]" : "[]"
            }
        });
    }
}
