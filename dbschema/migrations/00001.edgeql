CREATE MIGRATION m17syqhp6zn7gbrt7ckx4ybkaax6z4w3knl4fbjqagiacnowybfgsa
    ONTO initial
{
  CREATE MODULE extra IF NOT EXISTS;
  CREATE ABSTRACT TYPE default::HasData {
      CREATE OPTIONAL PROPERTY data -> std::str;
  };
  CREATE ABSTRACT TYPE default::HasTimestamps {
      CREATE OPTIONAL PROPERTY createdAt -> std::datetime {
          SET readonly := true;
          CREATE ANNOTATION std::description := 'Timestamp when this entity was created';
      };
      CREATE OPTIONAL PROPERTY updatedAt -> std::datetime {
          CREATE ANNOTATION std::description := 'Timestamp when this entity was updated';
      };
  };
  CREATE SCALAR TYPE default::PostStatus EXTENDING enum<Hidden, Private, Public, `Publish scheduled`>;
  CREATE SCALAR TYPE extra::MyEnum EXTENDING enum<`1`, `2`, `3`, `4`, `5`>;
  CREATE TYPE default::Post EXTENDING default::HasData {
      CREATE OPTIONAL PROPERTY nestingTest -> array<tuple<std::str, std::int16, std::int32, std::int64, array<tuple<std::int16, std::int32>>>>;
      ALTER PROPERTY data {
          SET OWNED;
          SET REQUIRED;
          SET TYPE std::str;
      };
      CREATE OPTIONAL PROPERTY externalId -> std::int16 {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE OPTIONAL PROPERTY status -> default::PostStatus {
          SET default := (default::PostStatus.Hidden);
      };
      CREATE REQUIRED PROPERTY isPublic := ((.status ?= default::PostStatus.Public));
      CREATE OPTIONAL PROPERTY metadata -> tuple<views: std::int64, words: std::int32, lines: std::int16>;
      CREATE OPTIONAL PROPERTY moduleTest -> extra::MyEnum;
      CREATE REQUIRED PROPERTY tags -> array<std::str>;
  };
  CREATE TYPE default::User EXTENDING default::HasTimestamps {
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE CONSTRAINT std::exclusive ON (.name);
      CREATE REQUIRED PROPERTY emailAddress -> std::str {
          CREATE CONSTRAINT std::regexp(r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
      };
      CREATE REQUIRED PROPERTY password -> std::str;
  };
  CREATE TYPE extra::MyType EXTENDING default::HasTimestamps {
      CREATE OPTIONAL PROPERTY enumTest -> extra::MyEnum;
      CREATE OPTIONAL PROPERTY jsonData -> std::json;
      CREATE OPTIONAL PROPERTY rangeTest -> range<std::int64>;
  };
  ALTER TYPE default::Post {
      CREATE REQUIRED LINK author -> default::User;
      CREATE OPTIONAL LINK featuredUser -> default::User;
      CREATE MULTI LINK reviewers -> default::User;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK posts := (.<author[IS default::Post]);
      CREATE MULTI LINK featuredInPosts := (.<featuredUser[IS default::Post]);
      CREATE MULTI LINK reviewerForPosts := (.<reviewers[IS default::Post]);
  };
};
