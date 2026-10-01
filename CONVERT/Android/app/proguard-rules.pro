# Proguard rules for NextAI Office Suite
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.room.* *;
}
-keep class com.nextaitechnology.officedocument.core.model.** { *; }
-keep class com.nextaitechnology.officedocument.core.network.dto.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Google Play Billing rules
-keep class com.android.billingclient.api.** { *; }
-keep class com.google.android.gms.internal.play_billing.** { *; }

# Billing Crash Protector
-keep class com.nextaitechnology.officedocument.core.crashlytics.BillingCrashProtector { *; }

