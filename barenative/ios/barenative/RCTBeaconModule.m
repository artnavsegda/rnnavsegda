//
//  RCTBeaconModule.m
//  barenative
//
//  Created by Art Navsegda on 08.01.2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <CoreLocation/CoreLocation.h>
#import "RCTBeaconModule.h"

@interface RCTBeaconModule() <CLLocationManagerDelegate>

@property (strong, nonatomic) CLLocationManager *locationManager;

@end

@implementation RCTBeaconModule
{
  bool hasListeners;
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (void)beaconEventReminderReceived:(NSNotification *)notification
{
  NSString *eventName = notification.userInfo[@"name"];
  if (hasListeners) { // Only send events if anyone is listening
    [self sendEventWithName:@"EventBeacon" body:@{@"name": eventName}];
  }
}

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(doSomething:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)
{
  NSInteger eventId = 123;
  callback(@[@(eventId)]);
  RCTLogInfo(@"Pretending %@ at %@", title, location);
}

RCT_EXPORT_METHOD(startMonitoringForRegion:(NSString *)uuid)
{
  //[self.locationManager startMonitoringForRegion:[self convertDictToBeaconRegion:dict]];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
  return [[UIDevice currentDevice] name];
}

@end
