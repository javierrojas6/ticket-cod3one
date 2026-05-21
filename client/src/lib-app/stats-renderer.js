import React from 'react';
import i18n from 'lib-app/i18n';
import StatCard from 'app-components/stat-card';
import { Bar, HorizontalBar } from 'react-chartjs-2';

const getStatsOptions = (axis) => {
  return {
    scales: {
      [`${axis}Axes`]: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
};

const renderStatCards = (ticketData) => {
  const { created, open, closed, instant, reopened } = ticketData;

  return (
    <div className="admin-panel-stats__card-list">
      <StatCard
        label={i18n('CREATED')}
        description={i18n('CREATED_DESCRIPTION')}
        value={created}
        isPercentage={false}
      />
      <StatCard label={i18n('OPEN')} description={i18n('OPEN_DESCRIPTION')} value={open} isPercentage={false} />
      <StatCard label={i18n('CLOSED')} description={i18n('CLOSED_DESCRIPTION')} value={closed} isPercentage={false} />
      <StatCard
        label={i18n('INSTANT')}
        description={i18n('INSTANT_DESCRIPTION')}
        value={(100 * instant) / closed}
        isPercentage={true}
      />
      <StatCard
        label={i18n('REOPENED')}
        description={i18n('REOPENED_DESCRIPTION')}
        value={(100 * reopened) / created}
        isPercentage={true}
      />
    </div>
  );
};

export default {
  renderStatistics({ showStatCards, showStatsByHours, showStatsByDays, ticketData }) {
    const primaryBlueWithTransparency = (alpha) => `rgba(32, 184, 197, ${alpha})`;
    const ticketsByHoursChartData = {
      labels: Array.from(Array(24).keys()),
      datasets: [
        {
          label: 'Created Tickets by Hour',
          backgroundColor: primaryBlueWithTransparency(0.2),
          borderColor: primaryBlueWithTransparency(1),
          borderWidth: 1,
          hoverBackgroundColor: primaryBlueWithTransparency(0.4),
          hoverBorderColor: primaryBlueWithTransparency(1),
          data: ticketData.created_by_hour
        }
      ]
    };

    const primaryGreenWithTransparency = (alpha) => `rgba(130, 202, 156, ${alpha})`;
    const ticketsByWeekdayChartData = {
      labels: [
        i18n('MONDAY'),
        i18n('TUESDAY'),
        i18n('WEDNESDAY'),
        i18n('THURSDAY'),
        i18n('FRIDAY'),
        i18n('SATURDAY'),
        i18n('SUNDAY')
      ],
      datasets: [
        {
          label: 'Created Tickets by Weekday',
          backgroundColor: primaryGreenWithTransparency(0.2),
          borderColor: primaryGreenWithTransparency(1),
          borderWidth: 1,
          hoverBackgroundColor: primaryGreenWithTransparency(0.4),
          hoverBorderColor: primaryGreenWithTransparency(1),
          data: ticketData.created_by_weekday
        }
      ]
    };

    return (
      <div>
        {showStatCards ? renderStatCards(ticketData) : null}
        {showStatsByHours ? (
          <Bar options={getStatsOptions('y')} data={ticketsByHoursChartData} legend={{ onClick: null }} />
        ) : null}
        {showStatsByDays ? (
          <HorizontalBar options={getStatsOptions('x')} data={ticketsByWeekdayChartData} legend={{ onClick: null }} />
        ) : null}
      </div>
    );
  }
};
