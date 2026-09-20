import { BarElement, CategoryScale, Chart, LinearScale, Tooltip, type ChartOptions } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip)

/** daisyUI theme colors as canvas-ready strings. */
function themeColor(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
}

export const barColor = () => themeColor('primary')

/** Shared look: no legend (one series), integer y axis from 0, recessive grid. */
export function barOptions(unit: string, title?: (index: number) => string): ChartOptions<'bar'> {
  const text = themeColor('base-content')
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: text } },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: text },
        grid: { color: themeColor('base-300') },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => (title ? title(items[0].dataIndex) : items[0].label),
          label: (item) => `${item.parsed.y} ${unit}`,
        },
      },
    },
  }
}
