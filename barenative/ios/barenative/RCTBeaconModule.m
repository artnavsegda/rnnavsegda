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

@property (strong, nonatomic) CLBeaconRegion *myBeaconRegion;
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

- (instancetype)init
{
  if (self = [super init]) {
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    [self.locationManager requestWhenInUseAuthorization];
  }

  return self;
}

RCT_EXPORT_METHOD(doSomething:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)
{
  NSInteger eventId = 123;
  callback(@[@(eventId)]);
  RCTLogInfo(@"Pretending %@ at %@", title, location);
}

RCT_EXPORT_METHOD(startMonitoringForRegion:(NSString *)uuidString)
{
  NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:uuidString];
  self.myBeaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:uuid identifier:@"art.navsegda.testregion"];
  [self.locationManager startRangingBeaconsInRegion:self.myBeaconRegion];
//  [self.locationManager startMonitoringForRegion:[self.myBeaconRegion]];
}

-(void)locationManager:(CLLocationManager*)manager
       didRangeBeacons:(NSArray*)beacons
              inRegion:(CLBeaconRegion*)region
{
    NSLog (@"Beacon found !!!");
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
  return [[UIDevice currentDevice] name];
}

@end
