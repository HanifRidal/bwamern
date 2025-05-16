// export default (number) => {
//   const formatNumbering = new Intl.NumberFormat("id-ID");
//   return formatNumbering.format(number);
// };

const formatNumber = (number) => {
  const formatNumbering = new Intl.NumberFormat("id-ID");
  return formatNumbering.format(number);
};

export default formatNumber;
