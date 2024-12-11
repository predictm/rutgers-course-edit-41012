from django.core.cache import cache


class CacheHelper:
    @staticmethod
    def get_from_cache(key):
        return cache.get(key)

    @staticmethod
    def set_to_cache(key, value, timeout=None):
        cache.set(key, value, timeout)

    @staticmethod
    def delete_from_cache(key):
        cache.delete(key)

    @staticmethod
    def get_or_set_cache(key, default_value, timeout=None):
        cached_data = cache.get(key)
        if cached_data is not None:
            return cached_data
        cache.set(key, default_value, timeout)

    @staticmethod
    def increment_cache(key, delta=1):
        return cache.incr(key, delta)

    @staticmethod
    def decrement_cache(key, delta=1):
        return cache.decr(key, delta)

    @staticmethod
    def cache_decorator(key_func, timeout=None):
        def decorator(func):
            def wrapper(*args, **kwargs):
                cache_key = key_func(*args, **kwargs)
                cached_data = cache.get(cache_key)
                if cached_data is not None:
                    return cached_data
                result = func(*args, **kwargs)
                cache.set(cache_key, result, timeout)
                return result
            return wrapper
        return decorator
    
    @staticmethod
    def get_cache_key(prefix, *args):
        # Combine relevant attributes to form a unique cache key
        cache_key = f"{prefix}_{'_'.join(str(arg) for arg in args)}"
        return cache_key
