// Synced from Feishu Base YOegbLb4SaifeCsAjRjchRx1n5c / tblyf2dtGWcr30JJ
// 20 products · 8 categories · Last synced: 2026-04-14

export type ProductCategory =
  | '传感器'
  | '核心处理部件'
  | '发射接收部件'
  | '辅助设备'
  | '激光雷达'
  | '毫米波雷达'
  | '组合导航系统'
  | '机器人控制器'

export type ProductStatusTag = '样品' | '量产' | '在售' | '停产'

export interface Product {
  id: string
  name: string
  code: string
  category: ProductCategory
  status: ProductStatusTag[]
  price: number
  tagline: string
  industry: string
  image: string
  keyParams: string
  detailSpecs: string
  dataSheetUrl?: string   // 可选：有真实文件/URL 时填入，留空则不显示下载按钮
}

export function isActive(p: Product): boolean {
  return p.status.includes('在售') && !p.status.includes('停产')
}

export function parseKeyParams(raw: string): { label: string; value: string }[] {
  if (!raw) return []
  return raw
    .split('；')
    .map(pair => {
      const i = pair.indexOf('：')
      if (i === -1) return null
      return { label: pair.slice(0, i).trim(), value: pair.slice(i + 1).trim() }
    })
    .filter(Boolean) as { label: string; value: string }[]
}

export const products: Product[] = [
  {
    id: 'RF-7701L',
    name: '77GHz 毫米波雷达发射模块 Lite',
    code: 'RF-7701L',
    category: '传感器',
    status: ['样品', '在售'],
    price: 5182.29,
    tagline: '一款专为汽车辅助驾驶领域设计的高性能77GHz毫米波雷达发射模块Lite，作为关键传感器组件，具备76–77GHz工作频段，配备2发射通道，输出功率达10dBm，支持1GHz带宽与FMCW调制方式。',
    industry: '汽车辅助驾驶',
    image: '/products/RF-7701L.png',
    keyParams: '工作频段：76–77GHz；发射通道：2Tx；输出功率：10dBm；调制方式：FMCW；带宽：1GHz；相位噪声：≤-95dBc/Hz；供电：5V DC；接口：SPI；尺寸：40×30×8mm；工作温度：-20~70℃',
    detailSpecs: '频段：76–77GHz；发射功率：10dBm；通道数：2Tx；带宽：1GHz',
  },
  {
    id: 'RF-7702P',
    name: '77GHz 毫米波雷达发射模块 Pro',
    code: 'RF-7702P',
    category: '传感器',
    status: ['量产', '在售'],
    price: 8697.15,
    tagline: '一款专为汽车自动驾驶领域设计的高性能77GHz毫米波雷达发射模块，采用FMCW调制方式，工作频段覆盖76–77GHz，配备3发射通道，输出功率达13dBm，具备2GHz带宽。',
    industry: '汽车自动驾驶',
    image: '/products/RF-7702P.png',
    keyParams: '工作频段：76–77GHz；发射通道：3Tx；输出功率：13dBm；调制方式：FMCW；带宽：2GHz；相位噪声：≤-100dBc/Hz；供电：5V DC；接口：SPI+CAN；尺寸：45×35×10mm；工作温度：-40~85℃',
    detailSpecs: '频段：76–77GHz；发射功率：13dBm；通道数：3Tx；带宽：2GHz',
  },
  {
    id: 'RF-7905M',
    name: '79GHz 多通道同步发射模块 Max',
    code: 'RF-7905M',
    category: '传感器',
    status: ['在售', '样品'],
    price: 21742.86,
    tagline: '一款专为汽车自动驾驶领域设计的高性能79GHz多通道同步发射模块，采用FMCW调制方式，工作频段覆盖77–81GHz，具备6发射通道，输出功率达16dBm，带宽4GHz，相位噪声≤-110dBc/Hz。',
    industry: '汽车自动驾驶',
    image: '/products/RF-7905M.png',
    keyParams: '工作频段：77–81GHz；发射通道：6Tx；输出功率：16dBm；调制方式：FMCW；带宽：4GHz；相位噪声：≤-110dBc/Hz；支持多模块级联同步；供电：5V DC；接口：Ethernet+CAN；尺寸：60×45×15mm；工作温度：-40~85℃',
    detailSpecs: '频段：77–81GHz；发射功率：16dBm；通道数：6Tx；同步能力：支持',
  },
  {
    id: 'AR-PJ003',
    name: '汽车雷达信号处理芯片',
    code: 'AR - PJ003',
    category: '核心处理部件',
    status: ['样品', '在售'],
    price: 1981.93,
    tagline: '一款适用于汽车自动驾驶领域的核心处理部件，汽车雷达信号处理芯片（产品编码：AR-PJ003）采用车规级SoC处理器架构，主频达800MHz，可支持目标检测、聚类、跟踪与滤波等功能，最大目标处理数为128个。',
    industry: '汽车自动驾驶',
    image: '/products/AR-PJ003.png',
    keyParams: '处理器架构：车规级SoC；主频：800MHz；支持目标检测、聚类、跟踪与滤波；最大目标处理数：128个；片上存储：8MB；接口：CAN FD、SPI、I2C；供电：5V；功耗：≤4W；工作温度：-40~125℃；封装：BGA；符合AEC-Q100',
    detailSpecs: '主频：800MHz；目标处理能力：128目标；接口：CAN FD / SPI；功耗：≤4W',
  },
  {
    id: 'AR-PJ004',
    name: '激光雷达反射镜组件',
    code: 'AR - PJ004',
    category: '核心处理部件',
    status: ['量产', '在售'],
    price: 3605.27,
    tagline: '一款应用于汽车自动驾驶领域的核心处理部件，激光雷达反射镜组件（产品编码：AR-PJ004），采用铝合金基材与光学镀膜工艺，适配905nm扫描式激光雷达。',
    industry: '汽车自动驾驶',
    image: '/products/AR-PJ004.png',
    keyParams: '类型：精密反射镜组件；适配波长：905nm；有效口径：42mm；反射率：≥95%；角度精度：±0.05°；基材：铝合金+光学镀膜；耐振动设计；工作温度：-40~85℃；适配扫描式激光雷达；尺寸：58×58×22mm',
    detailSpecs: '反射率：≥95%；口径：42mm；角度精度：±0.05°；适配905nm',
  },
  {
    id: 'AR-PJ005',
    name: '前碰撞预警雷达',
    code: 'AR - PJ005',
    category: '核心处理部件',
    status: ['样品', '在售'],
    price: 1738.6,
    tagline: '一款性能卓越的前碰撞预警雷达，作为汽车辅助驾驶的核心处理部件，采用77GHz频段，具备0–150m的探测范围和90°×18°的视场角，可实现64个目标的稳定跟踪。',
    industry: '汽车辅助驾驶',
    image: '/products/AR-PJ005.png',
    keyParams: '频段：77GHz；探测范围：0–150m；水平视场角：90°；垂直视场角：18°；距离精度：±0.2m；速度精度：±0.1m/s；目标跟踪：64个；支持前碰撞预警FCW；接口：CAN；供电：12V；工作温度：-40~85℃；防护等级：IP67',
    detailSpecs: '探测距离：150m；视场角：90°×18°；速度精度：±0.1m/s；支持FCW',
  },
  {
    id: 'AR-PJ006',
    name: '车载毫米波雷达天线',
    code: 'AR - PJ006',
    category: '发射接收部件',
    status: ['量产', '在售'],
    price: 7792.29,
    tagline: '一款专为汽车辅助驾驶设计的车载毫米波雷达天线（产品编码：AR-PJ006），作为核心发射接收部件，工作于77–81GHz频段，具备14dBi的天线增益与100°水平波束宽度，可实现对车辆周围环境的精准探测。',
    industry: '汽车辅助驾驶',
    image: '/products/AR-PJ006.png',
    keyParams: '类型：车载毫米波阵列天线；工作频段：77–81GHz；天线增益：14dBi；水平波束宽度：100°；垂直波束宽度：18°；驻波比：≤2.0；极化方式：线极化；接口：板载射频接口；尺寸：48×32×6mm；工作温度：-40~85℃',
    detailSpecs: '频段：77–81GHz；增益：14dBi；波束宽度：100°；驻波比：≤2.0',
  },
  {
    id: 'AR-PJ007',
    name: '盲点监测雷达传感器',
    code: 'AR - PJ007',
    category: '发射接收部件',
    status: ['样品', '在售'],
    price: 8907.15,
    tagline: '一款高性能的盲点监测雷达传感器，作为发射接收部件，采用77GHz频段，探测范围达0–80m，水平视场角150°、垂直视场角20°，距离精度±0.2m，速度精度±0.1m/s，可同时跟踪64个目标，支持BSD盲点检测。',
    industry: '汽车辅助驾驶',
    image: '/products/AR-PJ007.png',
    keyParams: '频段：77GHz；探测范围：0–80m；水平视场角：150°；垂直视场角：20°；距离精度：±0.2m；速度精度：±0.1m/s；目标跟踪：64个；支持BSD盲点检测；接口：CAN；供电：12V；工作温度：-40~85℃；防护等级：IP67',
    detailSpecs: '探测距离：80m；视场角：150°×20°；距离精度：±0.2m；支持BSD',
  },
  {
    id: 'AR-PJ008',
    name: '汽车雷达数据传输线',
    code: 'AR - PJ008',
    category: '发射接收部件',
    status: ['量产', '在售'],
    price: 5242.29,
    tagline: '一款应用于汽车辅助驾驶领域的发射接收部件，汽车雷达数据传输线（产品编码：AR-PJ008），作为车规级高速数据线，采用FAKRA-Z接口，标准长度2m并支持1m/3m定制。',
    industry: '汽车辅助驾驶',
    image: '/products/AR-PJ008.png',
    keyParams: '类型：车规级高速数据线；接口：FAKRA-Z；长度：2m（支持1m/3m定制）；阻抗：50Ω；传输速率：1Gbps；双层屏蔽结构；耐温：-40~105℃；防护等级：IP67；适配毫米波雷达与域控连接',
    detailSpecs: '传输速率：1Gbps；接口：FAKRA；长度：2m；屏蔽等级：双层',
  },
  {
    id: 'AR-PJ009',
    name: '自适应巡航雷达校准',
    code: 'AR - PJ009',
    category: '辅助设备',
    status: ['量产', '在售'],
    price: 4618.57,
    tagline: '一款专为汽车自动驾驶领域设计的辅助设备，采用便携式雷达校准方案，支持ACC毫米波雷达标定。',
    industry: '汽车自动驾驶',
    image: '/products/AR-PJ009.png',
    keyParams: '类型：便携式雷达校准设备；支持ACC毫米波雷达标定；角度校准精度：±0.1°；距离校准范围：0–200m；接口：USB、CAN；供电：12V DC；支持多车型标定流程；便携箱体设计；工作温度：-10~60℃',
    detailSpecs: '校准精度：±0.1°；校准距离：0–200m；接口：USB+CAN；适配ACC',
  },
  {
    id: 'AR-LR-001',
    name: '车规级 120° 超远距激光雷达 Pro',
    code: 'AR-LR-001',
    category: '激光雷达',
    status: ['在售', '量产'],
    price: 22192.56,
    tagline: '一款专为汽车自动驾驶打造的车规级激光雷达产品，具备120°×18°的视场角和0–300m的探测距离，128线通道设计搭配0.1°×0.1°的角分辨率，可实现高速场景下的远距离精准感知。',
    industry: '汽车自动驾驶',
    image: '/products/AR-LR-001.png',
    keyParams: '探测距离：0–300m；视场角：120°(H)×18°(V)；角分辨率：0.1°×0.1°；测距精度：±2cm；点云频率：20Hz；通道数：128线；激光波长：905nm；工作温度：-40℃~85℃；防护等级：IP67；适用场景：高速自动驾驶远距感知',
    detailSpecs: '探测距离：0–300m；视场角：120°×18°；角分辨率：0.1°×0.1°；通道数：128线',
  },
  {
    id: 'AR-LR-002',
    name: '车规级 90° 中距激光雷达 Lite',
    code: 'AR-LR-002',
    category: '激光雷达',
    status: ['量产', '在售'],
    price: 13555.42,
    tagline: '一款专为汽车自动驾驶打造的车规级90°中距激光雷达Lite（产品编码：AR-LR-002），具备卓越的环境感知性能。',
    industry: '汽车自动驾驶',
    image: '/products/AR-LR-002.png',
    keyParams: '探测距离：0–200m；视场角：90°(H)×16°(V)；角分辨率：0.2°×0.2°；测距精度：±3cm；点云频率：15Hz；通道数：64线；激光波长：905nm；工作温度：-40℃~85℃；防护等级：IP67；适用场景：ADAS前向感知',
    detailSpecs: '探测距离：0–200m；视场角：90°×16°；角分辨率：0.2°×0.2°；通道数：64线',
  },
  {
    id: 'AR-LR-005',
    name: '车规级 120° 超远距增强激光雷达 Max',
    code: 'AR-LR-005',
    category: '激光雷达',
    status: ['量产', '在售'],
    price: 42885.43,
    tagline: '一款适用于汽车自动驾驶领域的车规级激光雷达，产品编码AR-LR-005，具备120°×15°视场角与192线通道数，探测距离覆盖0–350m，角分辨率达0.05°×0.05°。',
    industry: '汽车自动驾驶',
    image: '/products/AR-LR-005.png',
    keyParams: '探测距离：0–350m；视场角：120°(H)×15°(V)；角分辨率：0.05°×0.05°；测距精度：±1cm；点云频率：25Hz；通道数：192线；激光波长：1550nm；抗强光能力：强；适用场景：L3/L4自动驾驶',
    detailSpecs: '探测距离：0–350m；视场角：120°×15°；角分辨率：0.05°×0.05°；通道数：192线',
  },
  {
    id: 'IR-LR-001',
    name: '迷你型 360° x 40° 室内导航激光雷达 Lite',
    code: 'IR-LR-001',
    category: '激光雷达',
    status: ['量产', '在售'],
    price: 8636.85,
    tagline: '一款专为室内机器人导航设计的迷你型激光雷达，产品编码IR-LR-001，具备360°×40°宽广视场角与0.5°×0.5°高精度角分辨率，探测距离覆盖0–20m。',
    industry: '机器人及工业',
    image: '/products/IR-LR-001.png',
    keyParams: '探测距离：0–20m；视场角：360°×40°；角分辨率：0.5°×0.5°；测距精度：±3cm；点云频率：10Hz；激光波长：905nm；功耗：≤5W；适用场景：室内机器人导航',
    detailSpecs: '探测距离：0–20m；视场角：360°×40°；角分辨率：0.5°×0.5°；功耗：≤5W',
  },
  {
    id: 'AR-MW-001',
    name: '车规级 77GHz 前向毫米波雷达 Pro',
    code: 'AR-MW-001',
    category: '毫米波雷达',
    status: ['量产', '在售'],
    price: 8426.85,
    tagline: '一款高性能的车规级77GHz前向毫米波雷达Pro（产品编码：AR-MW-001），工作频段77GHz，最大探测距离达250m，距离精度±0.1m，速度精度±0.1m/s，输出频率20Hz。',
    industry: '汽车自动驾驶',
    image: '/products/AR-MW-001.png',
    keyParams: '系统：工作频段77GHz，最大测距250m，距离精度±0.1m，速度精度±0.1m/s，输出频率20Hz；视场角：120°(H)×15°(V)，角分辨率1°；目标能力：支持128目标跟踪，支持多目标分离；性能：探测灵敏度高，支持雨雾环境稳定工作；接口：CAN/FlexRay；基础：IP67，-40~85℃，12V，<250g；功能：前向感知、自适应巡航（ACC）、AEB',
    detailSpecs: '探测距离：250m；视场角：120°×15°；速度精度：±0.1m/s；目标跟踪：128目标',
  },
  {
    id: 'IR-MW-006',
    name: '工业级 77GHz 室外避障毫米波雷达',
    code: 'IR-MW-006',
    category: '毫米波雷达',
    status: ['量产', '在售'],
    price: 8880.93,
    tagline: '一款专为机器人及工业领域设计的工业级77GHz室外避障毫米波雷达（产品编码：IR-MW-006），具备卓越的室外环境适应能力，采用77GHz频段技术，最大探测距离80m。',
    industry: '机器人及工业',
    image: '/products/IR-MW-006.png',
    keyParams: '系统：77GHz，最大测距80m，距离精度±0.2m，速度精度±0.15m/s，输出频率20Hz；视场角：120°×30°，角分辨率2°；目标能力：64目标；性能：抗雨雾抗粉尘；接口：RS485/CAN；基础：IP65，-40~85℃，24V，<300g；功能：机器人避障',
    detailSpecs: '探测距离：80m；视场角：120°×30°；距离精度：±0.2m；抗雨雾能力强',
  },
  {
    id: 'INS-001',
    name: '车规级组合惯导系统 Lite',
    code: 'INS-001',
    category: '组合导航系统',
    status: ['量产', '在售'],
    price: 14294.94,
    tagline: '一款面向汽车辅助驾驶领域的入门车规级组合导航系统，采用高性能MEMS传感器与GNSS接收机进行数据融合，实现优势互补。',
    industry: '汽车辅助驾驶',
    image: '/products/INS-001.png',
    keyParams: '系统：横滚/俯仰0.5°，航向0.8°，位置漂移1%（GNSS失锁1km或60s），输出频率50Hz；陀螺：零偏0.2°/s，标度误差5‰，零偏不稳定性20°/h，量程±250dps；加表：零偏10mg，标度误差5‰，零偏不稳定性0.2mg，量程±8g；GNSS：单点定位1.5m，更新5Hz，速度精度0.1m/s；基础：IP50，-30~75℃，12V，<350g；功能：单天线，入门车规级',
    detailSpecs: '横滚/俯仰：0.5°；航向：0.8°；单点定位：1.5m；输出频率：50Hz',
  },
  {
    id: 'INS-005',
    name: '工业级组合惯导系统 Lite',
    code: 'INS-005',
    category: '组合导航系统',
    status: ['量产', '在售'],
    price: 16119.35,
    tagline: '一款专为机器人及工业领域设计的工业级组合惯导系统 Lite（INS-005），集成高精度MEMS传感器与GNSS模块，通过先进的数据融合算法实现优势互补。',
    industry: '机器人及工业',
    image: '/products/INS-005.png',
    keyParams: '系统：横滚/俯仰0.5°，航向0.6°，位置漂移0.8%，输出频率100Hz；陀螺：零偏0.15°/s，标度误差4‰，零偏不稳定性15°/h，量程±300dps；加表：零偏8mg，标度误差4‰，零偏不稳定性0.15mg，量程±8g；GNSS：单点定位1m，更新10Hz，速度精度0.08m/s；基础：IP54，-40~85℃，24V，<350g；功能：工业稳定性增强',
    detailSpecs: '横滚/俯仰：0.5°；航向：0.6°；单点定位：1m；输出频率：100Hz',
  },
  {
    id: 'RC-100L',
    name: '入门级移动机器人控制器 Lite',
    code: 'RC-100L',
    category: '机器人控制器',
    status: ['量产', '在售'],
    price: 21442.86,
    tagline: '一款面向机器人及工业领域的入门级移动机器人控制器，产品编码RC-100L，采用四核ARM处理器，配备4GB内存与32GB存储，性能稳定可靠。',
    industry: '机器人及工业',
    image: '/products/RC-100L.png',
    keyParams: '处理器：四核ARM；内存：4GB；存储：32GB；DI：12路；DO：8路；CAN：1路；RS485：2路；以太网：1路千兆；USB：2路；支持SLAM导航；供电：24V DC；工作温度：-10~60℃',
    detailSpecs: '定位精度：±10mm；最大速度：1.5m/s；I/O：12DI/8DO；通信：CAN×1',
  },
  {
    id: 'RC-300X',
    name: '高性能机器人控制器 Plus',
    code: 'RC-300X',
    category: '机器人控制器',
    status: ['样品', '在售'],
    price: 52722.87,
    tagline: '一款高性能的机器人控制器，采用8核高性能CPU与16GB内存的强劲配置，实现精准高效的实时调度与多雷达/视觉融合处理。',
    industry: '机器人及工业',
    image: '/products/RC-300X.png',
    keyParams: '处理器：8核高性能CPU；内存：16GB；存储：128GB；DI：24路；DO：16路；CAN：2路；RS485：4路；以太网：2路千兆+1路2.5G；USB：4路；支持多雷达/视觉融合；支持实时调度；供电：24V DC',
    detailSpecs: '定位精度：±3mm；最大速度：3.5m/s；I/O：24DI/16DO；通信：CAN×2+以太网',
  },
]

export const activeProducts = products.filter(isActive)

export const categories: ProductCategory[] = [
  '传感器',
  '核心处理部件',
  '发射接收部件',
  '辅助设备',
  '激光雷达',
  '毫米波雷达',
  '组合导航系统',
  '机器人控制器',
]

export const categoryGroups: Record<string, Product[]> = Object.fromEntries(
  categories.map(cat => [cat, products.filter(p => p.category === cat)])
)
