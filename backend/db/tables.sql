DROP TABLE IF EXISTS "users";
CREATE TABLE "users"(
	"id"        Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"username"  Text NOT NULL,
	"password"  Text NOT NULL,
	"role"      Text NOT NULL,
	"lastLogin" DateTime,
	"sid"       Text,
	"session"   Text
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
	"readonly"       Boolean DEFAULT 0,
	"customizeUrl"   Text,
	"manifest"       Text,
	"parameters"     Text,
	"authorizations" Text,
	"attachments"    Text,
	"createdAt"      DateTime DEFAULT CURRENT_TIMESTAMP,
	"accessToken"    Text NOT NULL,
	"refreshToken"   Text NOT NULL,
    "tokenUri"       Text NOT NULL,
    "status"         Text,
    "patientName"    Text
);