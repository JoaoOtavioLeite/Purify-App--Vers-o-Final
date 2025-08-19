"use client"

import React from "react"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  data: DataPoint[]
  type: "bar" | "line" | "progress"
  height?: number
  showValues?: boolean
  maxValue?: number
  className?: string
}

export function SimpleChart({ 
  data, 
  type, 
  height = 120, 
  showValues = true,
  maxValue,
  className = ""
}: SimpleChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  if (type === "bar") {
    return (
      <div className={`w-full ${className}`}>
        <div 
          className="flex items-end justify-between gap-1"
          style={{ height: `${height}px` }}
        >
          {data.map((item, index) => {
            const percentage = (item.value / max) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t transition-all duration-1000 ease-out ${
                    item.color || "bg-blue-500"
                  }`}
                  style={{ 
                    height: `${percentage}%`,
                    minHeight: percentage > 0 ? "4px" : "0px"
                  }}
                  title={`${item.label}: ${item.value}`}
                />
                {showValues && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                    <div className="font-medium">{item.value}</div>
                    <div className="truncate w-12">{item.label}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (type === "line") {
    const svgWidth = 300
    const svgHeight = height
    const padding = 20
    
    const chartWidth = svgWidth - (padding * 2)
    const chartHeight = svgHeight - (padding * 2)
    
    const points = data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = padding + chartHeight - ((item.value / max) * chartHeight)
      return { x, y, ...item }
    })
    
    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ')
    
    return (
      <div className={`w-full ${className}`}>
        <svg width="100%" height={height} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1={padding}
              y1={padding + chartHeight * ratio}
              x2={svgWidth - padding}
              y2={padding + chartHeight * ratio}
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-200 dark:text-gray-700"
            />
          ))}
          
          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-blue-500"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="currentColor"
              className="text-blue-600"
            >
              <title>{`${point.label}: ${point.value}`}</title>
            </circle>
          ))}
        </svg>
        
        {showValues && (
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 text-center">
                <div className="truncate w-12">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (type === "progress") {
    return (
      <div className={`space-y-3 ${className}`}>
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    item.color || "bg-blue-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return null
}

// Componente de gráfico de pizza simples
interface PieChartProps {
  data: DataPoint[]
  size?: number
  showLabels?: boolean
  className?: string
}

export function SimplePieChart({ 
  data, 
  size = 120, 
  showLabels = true,
  className = ""
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2
  
  let cumulativeAngle = 0
  
  const colors = [
    "text-blue-500",
    "text-green-500", 
    "text-purple-500",
    "text-orange-500",
    "text-pink-500",
    "text-indigo-500"
  ]
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 360
          const startAngle = cumulativeAngle
          const endAngle = cumulativeAngle + angle
          
          const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
          const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
          const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
          const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)
          
          const largeArcFlag = angle > 180 ? 1 : 0
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ')
          
          cumulativeAngle += angle
          
          return (
            <path
              key={index}
              d={pathData}
              fill="currentColor"
              className={item.color || colors[index % colors.length]}
              opacity={0.8}
            >
              <title>{`${item.label}: ${item.value} (${((item.value / total) * 100).toFixed(1)}%)`}</title>
            </path>
          )
        })}
      </svg>
      
      {showLabels && (
        <div className="mt-4 space-y-1 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color || colors[index % colors.length]} opacity-80`} />
                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
