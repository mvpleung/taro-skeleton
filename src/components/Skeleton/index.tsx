import { View, Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import './index.scss'

/**
 * @description 骨架屏组件参数
 * @author lentoo
 * @update Liangzc
 * @date 2019-08-16
 * @export
 * @interface SkeletonProps
 */
export interface SkeletonProps {
  /**
   * @description 排列方向  横向 或者 纵向， 默认 row
   * @type {('row' | 'column')}
   * @memberof SkeletonProps
   */
  type?: 'row' | 'column'
  /**
   * @description 段落占位图行数
   * @type {number}
   */
  row?: number
  /**
   * @description 是否显示占位图，传 `false` 时会展示子组件内容
   * @type {boolean}
   */
  loading?: boolean
  /**
   * @description 是否显示标题占位图
   * @type {boolean}
   */
  title?: boolean
  /**
   * @description 标题占位图宽度和高度
   * @type {AttrProps}
   */
  titleProps?: AttrProps
  /**
   * @description 是否显示头像占位图
   * @type {boolean}
   */
  avatar?: boolean
  /**
   * @description avatar-size
   * @type {(number | AttrProps)}
   */
  avatarSize?: number | AttrProps
  /**
   * @description 头像占位图形状，可选值为 `square` 、`round` 默认值：round
   * @type {AvatarShapeOptions}
   */
  avatarShape?: AvatarShapeOptions
  /**
   * @description 是否显示右边操作按钮占位图
   * @type {boolean}
   */
  action?: boolean
  /**
   * @description actions操作为的宽、高属性
   * @type {boolean}
   */
  actionProps?: AttrProps
  /**
   * @description 是否开启动画
   * @type {boolean}
   */
  animate?: boolean
  /**
   * @description 动画名称
   * @type {AnimateName}
   * @memberof SkeletonProps
   */
  animateName?: AnimateName
  /**
   * @description 段落占位图宽度，可传数组来设置每一行的宽度
   * @type {(number | string | (number | string)[])}
   */
  rowWidth?: number | string | (number | string)[]
  /**
   * @description 段落占位图高度，可传数组来设置每一行的高度
   * @type {(number | string | (number | string)[])}
   * @memberof SkeletonProps
   */
  rowHeight?: number | string | (number | string)[]
  /**
   * @description 用于定制 row 的宽跟高，可传数组来设置每一行的宽跟高，如果配置了该属性，则 rowWidth 配置无效
   * @type {(AttrProps | AttrProps[])}
   * @memberof SkeletonProps
   */
  rowProps?: AttrProps | AttrProps[]
  /**
   * @description 骨架颜色
   * @type {string}
   * @memberof SkeletonProps
   */
  skeletonColor: string
  /**
   * @description 是否使用自定义骨架内容，开启时，会使用 renderCustom 作为内容填充
   * @type {boolean}
   */
  custom?: boolean
  /**
   * @description 自定义骨架内容，仅当 custom 为 true 时有效
   * @type {JSX.Element}
   */
  renderCustom?: JSX.Element
  /**
   * @description 子组件内容
   * @type {JSX.Element}
   */
  children?: JSX.Element
}
/**
 * @description 属性的宽高
 * @author liangzc
 * @date 2019-12-15
 * @export
 * @interface AttrProps
 */
export interface AttrProps {
  width?: string | number
  height?: string | number
  [propName: string]: any
}
export type AnimateName = 'blink' | 'elastic'
export type AvatarShapeOptions = 'round' | 'square'
const DEFAULT_ROW_WIDTH = '100%'
export default function Skeleton(props: SkeletonProps) {
  if (!props.loading) {
    return <View>{props.children}</View>
  }

  const getRowWidth = (index: number) => {
    if (props.rowProps) {
      if (Array.isArray(props.rowProps)) {
        return props.rowProps[index].width
      }
      return props.rowProps.width
    }

    if (props.rowWidth === DEFAULT_ROW_WIDTH) {
      return DEFAULT_ROW_WIDTH
    }
    if (Array.isArray(props.rowWidth)) {
      return props.rowWidth[index]
    }
    return props.rowWidth
  }

  const getRowHeight = (index: number) => {
    if (props.rowProps) {
      if (Array.isArray(props.rowProps)) {
        return props.rowProps[index].height
      }
      return props.rowProps.height
    }

    if (Array.isArray(props.rowHeight)) {
      return props.rowHeight[index]
    }
    return props.rowHeight
  }

  const addUnit = (value?: string | number) => {
    return typeof value === 'number' ? Taro.pxTransform(value) : value
  }

  const renderAvatar = (): JSX.Element | null => {
    if (props.avatar) {
      const avatarClass = classnames('skeleton-avatar', {
        'skeleton-avatar-round': props.avatarShape === 'round'
      })
      const avatarProps =
        typeof props.avatarSize === 'number'
          ? { width: props.avatarSize, height: props.avatarSize }
          : props.avatarSize || {}
      return (
        <View
          className={avatarClass}
          style={{
            width: addUnit(avatarProps.width),
            height: addUnit(avatarProps.height),
            backgroundColor: props.skeletonColor
          }}
        />
      )
    }
    return null
  }

  const renderTitle = (): JSX.Element | null => {
    if (props.title) {
      const titleProps = props.titleProps || {}
      return (
        <View
          className="skeleton-title"
          style={{
            ...titleProps,
            width: addUnit(titleProps.width),
            height: addUnit(titleProps.height),
            backgroundColor: props.skeletonColor
          }}
        />
      )
    }
    return null
  }
  const renderAction = (): JSX.Element | null => {
    if (props.action && props.type !== 'column') {
      const actionProps = props.actionProps || {}
      return (
        <View
          className="skeleton-action"
          style={{
            ...actionProps,
            width: addUnit(actionProps.width),
            height: addUnit(actionProps.height),
            backgroundColor: props.skeletonColor
          }}
        />
      )
    }
    return null
  }
  const renderRows = (): JSX.Element | null => {
    if (props.row) {
      const rowArray = Array.apply(null, Array(props.row)).map(
        (_item, index) => index
      )
      const Rows = rowArray.map((item, index) => {
        return (
          <View
            key={item}
            className="skeleton-row"
            style={{
              width: addUnit(getRowWidth(index)),
              height: addUnit(getRowHeight(index)),
              backgroundColor: props.skeletonColor
            }}
          />
        )
      })
      return <View className="skeleton-rows">{Rows}</View>
    }
    return null
  }

  const rootClass = classnames([
    'skeleton',
    {
      [`skeleton-type-${props.type}`]: true,
      'skeleton-animate-blink': props.animate && props.animateName === 'blink',
      'skeleton-animate-elastic':
        props.animate && props.animateName === 'elastic'
    }
  ])

  const custom = props.custom
  return (
    <View className={rootClass}>
      {custom ? (
        <View className="skeleton-custom">{props.renderCustom}</View>
      ) : (
        <Block>
          {renderAvatar()}
          <View className="skeleton-content">
            {renderTitle()}
            {renderRows()}
          </View>
          {renderAction()}
        </Block>
      )}
    </View>
  )
}
Skeleton.options = {
  addGlobalClass: true
}
Skeleton.defaultProps = {
  avatarSize: 90,
  type: 'row',
  row: 0,
  loading: true,
  animate: true,
  rowWidth: '100%',
  rowHeight: 24,
  titleProps: {
    width: '40%'
  },
  avatarShape: 'round',
  animateName: 'blink',
  skeletonColor: '#f2f3f5',
  custom: false
}
