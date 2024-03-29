DROP TABLE IF EXISTS "users";
CREATE TABLE "users"(
	"id"        Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"username"  Text NOT NULL,
	"password"  Text NOT NULL
);

DROP TABLE IF EXISTS "sessions";
CREATE TABLE "sessions"(
	"id"      Text NOT NULL,
	"user_id" Integer NOT NULL,
	"expires" DateTime NOT NULL,
	"session" Text
);

DROP TABLE IF EXISTS "institutions";
CREATE TABLE "institutions"(
	"id"          Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"displayName" Text NOT NULL,
	"fhirUrl"     Text,
	"location"    Text,
	"disabled"    Boolean,
	"clientId"    Text NOT NULL,
	"scope"       Text NOT NULL
);

DROP TABLE IF EXISTS "jobs";
CREATE TABLE "jobs"(
	"id"             Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"userId"         Integer NOT NULL,
	"patientId"      Text    NOT NULL,
	"statusUrl"      Text,
	"customizeUrl"   Text,
	"manifest"       Text,
	"parameters"     Text,
	"authorizations" Text,
	"attachments"    Text,
	"createdAt"      DateTime DEFAULT CURRENT_TIMESTAMP,
    "approvedAt"     DateTime,
	"accessToken"    Text NOT NULL,
	"refreshToken"   Text NOT NULL,
    "tokenUri"       Text NOT NULL,
    "status"         Text,
    "patientName"    Text
);