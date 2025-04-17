export function calculateGPA(results: any[]): number {
  if (results.length === 0) return 0;
  let totalCredits = 0;
  let totalWeightedScore = 0;
  results.forEach((result) => {
    const score = parseFloat(result.score); // Điểm tổng kết
    if (score >= 5) {
      totalCredits += result.class.subject.credit;
      totalWeightedScore += score * result.class.subject.credit;
    }
  });
  return totalCredits > 0 ? totalWeightedScore / totalCredits : 0;
}
