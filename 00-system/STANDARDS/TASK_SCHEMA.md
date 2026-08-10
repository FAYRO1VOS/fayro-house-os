# Task Schema

Her görev kaydı için desteklenmesi gereken alanlar (henüz veritabanı değil, sadece alan tanımı):

TASK_ID, TITLE, OWNER, CLIENT/PROJECT, CATEGORY, PRIORITY, STATUS, CREATED_DATE, DUE_DATE, DEPENDENCY, APPROVAL_REQUIRED, EXPECTED_OUTPUT, FILE_LOCATION, NOTES, RISKS, CHECKLIST_REF

STATUS: bkz. STATUS_STANDARD.md (görev döngüsü)
PRIORITY: bkz. PRIORITY_STANDARD.md
APPROVAL_REQUIRED: bkz. APPROVAL_GATES.md
DUE_DATE: zorunludur — teslim tarihi olmayan görev oluşturulmaz.
OWNER: her görevin tek bir sorumlusu olur. Destek veren başka kişiler olabilir ama sorumluluk paylaşılmaz.

## Görev Devri (OWNER değiştiğinde)
REASON, NEW_OWNER, NEW_DUE_DATE, LAST_STATUS kaydedilir.

## Gecikme Protokolü (DUE_DATE geçtiğinde)
REASON, RESPONSIBLE, SOLUTION, NEW_PLAN kaydedilir.

Gelecekte gerekiyorsa eklenebilir (bugün zorunlu değil): TIME_ESTIMATE, ACTUAL_TIME, PERFORMANCE_RESULT — role bazlı performans göstergeleri için (bkz. Legacy Spec madde 2.13, FUTURE CAPABILITY). Bugün gereksiz veri girişi yaratılmaz.

Kaynak: Legacy FAYRO OS Specification v1.0, madde 2.11, 5.3, 5.7, 5.8, 5.11, 5.19 (Controlled Knowledge Import, Part 02 + Part 05)
