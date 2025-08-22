// 正则表达式
// 避免相互影响业务，非正则本身逻辑问题只新增

export default {
  // 正整数
  POSITIVE_INTEGER_REGX: /^[0-9]*[1-9][0-9]*$/,
  // 非负整数
  NONNEGATIVE_INTEGER_REGX: /^\d+$/,
  // 密码 至少8个字符 包含大写字母（A-Z）包含小写字母（a-z）包含数字（0-9）包含特殊字符（如 !@#$%^&*）
  PASSWORD_REGX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  // 邮箱
  EMAIL_REGX: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
  // 手机号码
  TELLPHONE_REGX: /^(1)\d{10}$/,
  // 电话号码
  LANDLING_PHONE_REGX: /^((\d{3,4}-)|\d{3.4}-)?\d{7,11}$/,
  // 只包括数字、字母、下划线
  COMMON_CODE_REGX: /^[5A-Za-z0-9-\\_]+$/,
  // 字母和数字
  LETTER_NUMBER_REGX: /^[A-Za-z0-9]+$/
}
